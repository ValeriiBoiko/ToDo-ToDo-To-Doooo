import React, { ForwardedRef, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Keyboard, KeyboardEvent, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { addItem } from '../actions';
import { Font } from '../constants';
import { ColorTheme, RootState } from '../types';
import { wp } from '../utils';

interface Props {
  colors: ColorTheme,
  addItem: (title: string) => Function,
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function NewItem({ colors, addItem }: Props, ref: ForwardedRef<TextInput>) {
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [height, setHeight] = useState(wp(-120));
  const animatedPosition = useRef(new Animated.Value(0)).current;
  const animatedOptions = useRef(new Animated.Value(0)).current;
  const [isOptionsOpen, setOptionsFlag] = useState(false);
  const [value, setValue] = useState('');

  const runPositionAnimation = (targetValue: number) => {
    Animated.timing(
      animatedPosition,
      {
        toValue: targetValue,
        duration: 250,
        easing: Easing.linear,
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

  useEffect(() => {
    const onKeyboardShow = (e: KeyboardEvent) => setHeight(e.endCoordinates.height);
    const onKeyboardDidShow = (e: KeyboardEvent) => setHeight(e.endCoordinates.height);
    const onKeyboardHide = () => {
      setHeight(wp(-120));
      setOptionsFlag(false);
      runOptionsAnimation(0);
    };

    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', onKeyboardShow);
      Keyboard.addListener('keyboardWillHide', onKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
      Keyboard.addListener('keyboardDidHide', onKeyboardHide);
    }

    return () => {
      Keyboard.removeListener('keyboardWillShow', onKeyboardShow);
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardWillHide', onKeyboardHide);
      Keyboard.removeListener('keyboardDidHide', onKeyboardHide);
    }
  }, []);

  useEffect(() => {
    if (!height) {
      runPositionAnimation(0)
    } else {
      runPositionAnimation(1)
    }
  }, [height]);

  const position = animatedPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [wp(-120), height],
  });

  const optionsPosition = animatedOptions.interpolate({
    inputRange: [0, 1],
    outputRange: [wp(170), 0],
  });

  const moreButtonAngle = animatedOptions.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={[
      styles.container,
      { bottom: position, }
    ]}>
      <View style={styles.moreOptions}>
        <Animated.View style={[
          styles.optionsContainer,
          { transform: [{ translateY: optionsPosition }] }
        ]}>
          <TextInput
            multiline={true}
            placeholder={'Type a note'}
            style={styles.note}
          />
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

      <View style={{ flexDirection: 'row' }}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={setValue}
          style={styles.input} />
        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={() => {
            if (value) {
              addItem(value);
              setValue('');
            }
          }} >
          <Icon name={'add'} size={wp(25)} color={'#fff'} style={styles.icon} />
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
    fontSize: wp(16),
    fontFamily: Font.REGULAR,
    textAlignVertical: 'top',
    backgroundColor: colors.card,
  },
  optionsContainer: {
    height: wp(170),
    backgroundColor: colors.card,
    borderRadius: wp(8),
    padding: wp(8),
    flex: 1,
  }
});

const maStateToProps = (state: RootState) => ({
  colors: state.theme,
})

const mapDispatchToState = (dispatch: Function) => ({
  addItem: (title: string) => dispatch(addItem(title)),
})

export default connect(
  maStateToProps, mapDispatchToState, null, { forwardRef: true }
)(forwardRef(NewItem));
