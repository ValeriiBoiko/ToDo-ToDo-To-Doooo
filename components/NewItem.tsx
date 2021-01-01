import React, { ForwardedRef, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Keyboard, KeyboardEvent, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { addItem } from '../actions';
import { Font } from '../constants';
import { ColorTheme, ListItem, RootState } from '../types';
import { wp } from '../utils';
import Toggle from './Toggle';

interface Props {
  colors: ColorTheme,
  onAdded?: () => void,
  onCancelled?: () => void,
  addItem: (item: Omit<ListItem, 'id'>) => Function,
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function NewItem({ colors, addItem, onAdded, onCancelled }: Props, ref: ForwardedRef<TextInput>) {
  const styles = useMemo(() => getStyles(colors), [colors]);
  const animatedPosition = useRef(new Animated.Value(wp(-200))).current;
  const animatedOptions = useRef(new Animated.Value(0)).current;
  const [isOptionsOpen, setOptionsFlag] = useState(false);
  const [item, setItem] = useState({
    title: '',
    isDaily: false,
    isDone: false,
    note: '',
  });

  const runPositionAnimation = (targetValue: number) => {
    Animated.timing(
      animatedPosition,
      {
        toValue: targetValue,
        duration: 250,
        easing: Easing.bezier(0, .6, .53, .82),
        useNativeDriver: false,
      }
    ).start();
  };

  const runOptionsAnimation = (targetValue: number) => {
    Animated.timing(
      animatedOptions,
      {
        toValue: targetValue,
        duration: 200,
        easing: Easing.bezier(.43, 0, .55, 1),
        useNativeDriver: true,
      }
    ).start();
  };

  const onMorePressed = () => {
    if (isOptionsOpen) {
      setOptionsFlag(false);
      runOptionsAnimation(0);
    } else {
      setOptionsFlag(true);
      runOptionsAnimation(1);
    }
  }

  const onHide = () => {
    Keyboard.dismiss();
    runPositionAnimation(wp(-200));
    setOptionsFlag(false);
    setItem({
      isDone: false,
      isDaily: false,
      title: '',
      note: ''
    });
    runOptionsAnimation(0);
    onCancelled && onCancelled();
  }

  useEffect(() => {
    const onKeyboardWillShow = (e: KeyboardEvent) => runPositionAnimation(e.endCoordinates.height);
    const onKeyboardDidShow = (e: KeyboardEvent) => runPositionAnimation(0);
    const onKeyboardHide = () => onHide();

    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', onKeyboardWillShow);
      Keyboard.addListener('keyboardWillHide', onKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
      Keyboard.addListener('keyboardDidHide', onKeyboardHide);
    }

    return () => {
      Keyboard.removeListener('keyboardWillShow', onKeyboardWillShow);
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardWillHide', onKeyboardHide);
      Keyboard.removeListener('keyboardDidHide', onKeyboardHide);
    }
  }, []);

  const optionsPosition = animatedOptions.interpolate({
    inputRange: [0, 1],
    outputRange: [wp(140), 0],
  });

  const moreButtonAngle = animatedOptions.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={[
      styles.container,
      { bottom: animatedPosition }
    ]}>
      <Pressable onPress={onHide}>
        <View style={styles.moreOptions}>
          <Animated.View style={[
            styles.optionsContainer,
            { transform: [{ translateY: optionsPosition }] }
          ]}>
            <TextInput
              multiline={true}
              placeholder={'Type a note'}
              placeholderTextColor={colors.border}
              style={styles.note}
              value={item.note}
              onChangeText={(note) => {
                setItem({
                  ...item,
                  note
                })
              }}
            />
            <View style={styles.daily}>
              <Text style={styles.dailyLabel}>Daily</Text>
              <Toggle
                isOn={item.isDaily}
                onToggle={(isDaily) => {
                  setItem({
                    ...item,
                    isDaily
                  })
                }}
                trackColor={colors.background}
                onThumbColor={colors.primary}
                offThumbColor={colors.border}
              />
            </View>
          </Animated.View>

          <Pressable
            style={[styles.button, styles.moreButton]}
            onPress={onMorePressed} >
            <AnimatedIcon
              name={'expand-less'}
              size={wp(30)}
              color={colors.border}
              style={[
                styles.icon,
                { transform: [{ rotate: moreButtonAngle }] }
              ]} />
          </Pressable>
        </View>
      </Pressable>

      <View style={{ flexDirection: 'row' }}>
        <TextInput
          ref={ref}
          placeholder={'Item title'}
          placeholderTextColor={colors.border}
          value={item.title}
          onChangeText={(title) => {
            setItem({
              ...item,
              title
            })
          }}
          style={styles.input} />
        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={() => {
            if (item.title.length) {
              onAdded && onAdded();
              addItem(item);
              setItem({
                isDone: false,
                isDaily: false,
                title: '',
                note: ''
              });
            }
          }} >
          <Icon name={'add'} size={wp(25)} color={colors.invertedText} style={styles.icon} />
        </Pressable>
      </View>

    </Animated.View>
  )
}

const getStyles = (colors: ColorTheme) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: wp(20),
    paddingBottom: wp(8),
  },
  input: {
    padding: 0,
    height: wp(45),
    flex: 1,
    borderTopLeftRadius: wp(8),
    borderBottomLeftRadius: wp(8),
    borderRadius: wp(8),
    marginRight: wp(8),
    paddingHorizontal: wp(12),
    fontSize: wp(16),
    fontFamily: Font.REGULAR,
    color: colors.text,
    backgroundColor: colors.card,
  },
  icon: {
    textAlign: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: wp(45),
    width: wp(55),
    borderRadius: wp(8),
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  moreButton: {
    backgroundColor: colors.card,
    marginLeft: wp(8),
  },
  moreOptions: {
    marginBottom: wp(8),
    alignItems: 'flex-end',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  note: {
    flex: 1,
    padding: 0,
    marginRight: wp(8),
    borderRadius: wp(8),
    color: colors.text,
    fontSize: wp(16),
    fontFamily: Font.REGULAR,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
  },
  optionsContainer: {
    height: wp(140),
    backgroundColor: colors.card,
    borderRadius: wp(8),
    padding: wp(8),
    flex: 1,
  },
  daily: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  dailyLabel: {
    fontSize: wp(16),
    fontFamily: Font.REGULAR,
    color: colors.border,
    marginRight: wp(8),
  }
});

const maStateToProps = (state: RootState) => ({
  colors: state.theme,
})

const mapDispatchToState = (dispatch: Function) => ({
  addItem: (item: Omit<ListItem, 'id'>) => dispatch(addItem(item)),
})

export default connect(
  maStateToProps, mapDispatchToState, null, { forwardRef: true }
)(forwardRef(NewItem));
