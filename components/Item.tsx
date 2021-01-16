import React, { useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Font } from '../constants';
import { ColorTheme, ListItem, RootState } from '../types';
import { wp } from '../utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton, State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, { and, block, Clock, cond, Easing, eq, event, interpolate, set, startClock, stopClock, timing, Value } from 'react-native-reanimated';

interface Props extends ListItem {
  colors: ColorTheme,
  onLongPress?: (e: GestureResponderEvent) => void,
  onDelete: (itemId: number) => void,
  [props: string]: any,
}

function Item({ id, title, isDone, note, isDaily, colors, onPress, onDelete, onLongPress, ...props }: Props) {
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [noteMaxHeight, setNoteHeight] = useState(150);
  const [itemHeight, setItemHeight] = useState(wp(40));
  const clock = useRef(new Clock()).current;
  const gestureState = useRef(new Value(-1)).current;

  const runReAnimation = (clock: Clock, gestureState) => {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
    };

    const config = {
      duration: 250,
      toValue: new Value(1),
      easing: Easing.linear
    }

    return block([
      cond(
        eq(gestureState, State.BEGAN),
        [
          set(state.finished, 0),
          set(state.time, 0),
          set(state.frameTime, 0),
          startClock(clock)
        ]
      ),
      timing(clock, state, config),
      cond(
        state.finished,
        stopClock(clock),
        cond(
          and(eq(config.toValue, 1), eq(state.position, 1)),
          set(config.toValue, 0),
          cond(
            and(eq(config.toValue, 0), eq(state.position, 0)),
            set(config.toValue, 1)
          )
        ),
      ),
      interpolate(state.position, {
        inputRange: [0, 1],
        outputRange: [0, 1]
      })
    ])
  }

  const toggleNote = event([
    {
      nativeEvent: {
        state: gestureState
      }
    }
  ])


  const animatedValue = runReAnimation(clock, gestureState);
  const containerHeight = interpolate(animatedValue, {
    inputRange: [0, 1],
    outputRange: [itemHeight, noteMaxHeight + itemHeight]
  })

  const renderRightActions = (progress: any, dragX: any) => {
    const iconTransition = dragX.interpolate({
      inputRange: [wp(-60), 0],
      outputRange: [0, wp(30)],
    });

    return (
      <RectButton style={styles.deleteButton} onPress={() => onDelete(id)}>
        <View>
          <Icon name={'delete-outline'} size={wp(22)} color={colors.background} />
        </View>
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
                <Animated.View>
                  <TapGestureHandler onHandlerStateChange={toggleNote} >
                    <Animated.View style={{ paddingLeft: wp(20) }}>
                      <Icon name={'expand-more'} size={wp(32)} color={colors.border} />
                    </Animated.View>
                  </TapGestureHandler>
                </Animated.View>
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
