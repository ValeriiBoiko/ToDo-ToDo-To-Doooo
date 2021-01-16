import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Font } from '../constants';
import { ColorTheme, ListItem, RootState } from '../types';
import { wp } from '../utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';

interface Props extends ListItem {
  colors: ColorTheme,
  onLongPress?: (e: GestureResponderEvent) => void,
  onDelete: (itemId: number) => void,
  [props: string]: any,
}

function Item({ id, title, isDone, note, isDaily, colors, onPress, onDelete, onLongPress, ...props }: Props) {
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [isOpen, setOpenFlag] = useState(false);
  const [noteMaxHeight, setNoteHeight] = useState(150);
  const [itemHeight, setItemHeight] = useState(50);
  const animated = useRef(new Animated.Value(0)).current;

  const runAnimation = (targetValue: number) => {
    Animated.timing(
      animated,
      {
        duration: 400,
        toValue: targetValue,
        easing: Easing.bezier(.43, 0, .55, 1),
        useNativeDriver: false,
      }
    ).start();
  };

  useEffect(() => {
    if (isOpen) {
      runAnimation(1);
    } else {
      runAnimation(0);
    }
  }, [isOpen])

  const containerHeight = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [itemHeight, noteMaxHeight + itemHeight]
  })

  const renderRightActions = (progress: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation) => {
    const iconTransition = dragX.interpolate({
      inputRange: [wp(-60), 0],
      outputRange: [0, wp(30)],
    });

    return (
      <RectButton style={styles.deleteButton} onPress={() => onDelete(id)}>
        <Animated.View style={{
          transform: [{ translateX: iconTransition }]
        }}>
          <Icon name={'delete-outline'} size={wp(22)} color={colors.background} />
        </Animated.View>
      </RectButton>
    );
  }

  return (
    <Swipeable containerStyle={styles.underlay} renderRightActions={renderRightActions}>
      <View {...props} style={[
        styles.container,
        props.style
      ]}>
        <Animated.View
          style={{
            height: containerHeight,
            overflow: 'hidden'
          }}>
          <View style={styles.item} onLayout={({ nativeEvent }) => {
            setItemHeight(nativeEvent.layout.height);
          }}>

            <Pressable
              style={{ flex: 1, ...styles.item }}
              onLongPress={(e) => { onLongPress && onLongPress(e) }}
              onPress={onPress}>
              <View style={[
                styles.checkbox,
                {
                  backgroundColor: isDone ? colors.primary : colors.background,
                  borderColor: isDone ? colors.primary : colors.border,
                }
              ]}>
                {isDone && <Icon name='done' size={wp(20)} color={colors.invertedText} />}
              </View>

              <Text style={styles.title}>{title}</Text>

              {
                isDaily && (
                  <View>
                    <Icon name='date-range' size={wp(22)} color={colors.border} />
                    <View style={styles.dailyBadge} />
                  </View>
                )
              }
            </Pressable>

            {
              note ? (
                <Pressable style={{ paddingLeft: wp(20), }} onPress={() => setOpenFlag(!isOpen)}>
                  <Icon name={'expand-more'} size={wp(32)} color={colors.border} />
                </Pressable>
              ) : null
            }
          </View>

          <Text
            onLayout={({ nativeEvent }) => setNoteHeight(nativeEvent.layout.height)}
            style={[
              { top: itemHeight },
              styles.note
            ]}>{note}</Text>
        </Animated.View>
      </View >
    </Swipeable>
  )
}

const getStyles = (colors: ColorTheme) => StyleSheet.create({
  underlay: {
    backgroundColor: '#ff5252',
    borderRadius: wp(8),
  },
  container: {
    overflow: 'hidden',
    backgroundColor: colors.background
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35),
    marginRight: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: {
    flex: 1,
    fontSize: wp(16),
    color: colors.text,
    padding: 0,
    fontFamily: Font.REGULAR
  },
  dailyBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: wp(8),
    height: wp(8),
    borderRadius: wp(8),
    backgroundColor: colors.primary
  },
  deleteButton: {
    width: wp(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    position: 'absolute',
    paddingLeft: wp(45),
    paddingTop: wp(8),
    fontSize: wp(14),
    lineHeight: wp(20),
    color: colors.text,
    opacity: .7,
    fontFamily: Font.REGULAR
  }
})

const mapStateToProps = (state: RootState) => ({
  colors: state.theme,
});

export default connect(mapStateToProps)(Item);
