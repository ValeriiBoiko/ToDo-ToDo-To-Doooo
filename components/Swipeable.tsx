import React, { FunctionComponent, useRef } from 'react';
import { Dimensions, ViewProps } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { abs, add, and, block, call, Clock, cond, divide, Easing, eq, event, greaterOrEq, greaterThan, interpolate, lessOrEq, neq, set, startClock, stopClock, timing, Value } from 'react-native-reanimated';
import { useEffect } from 'react';

interface Props extends ViewProps {
  triggerPosition?: number,
  minDist?: number,
  disabled?: boolean,
  onSwiped: (args: readonly never[]) => void,
}

const Swipeable: FunctionComponent<Props> = ({
  triggerPosition = .15,
  minDist = 20,
  disabled,
  onSwiped,
  ...props }) => {
  const screenWidth = Dimensions.get('window').width;

  const isEnabled = useRef(new Value(0)).current;
  const gestureState = useRef(new Value(0)).current;
  const dragX = useRef(new Value(0)).current;
  const offsetX = useRef(new Value(0)).current;
  const clock = useRef(new Clock()).current;

  const onRecipeDrag = event([
    {
      nativeEvent: {
        state: gestureState,
        translationX: dragX,
      }
    }
  ])

  function positionRecipe(clock: Clock, gestureState: Value<number>) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
    };

    const config = {
      duration: 150,
      toValue: new Value(0),
      easing: Easing.linear,
    };

    return (
      block([
        cond(
          eq(gestureState, State.ACTIVE),
          [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.frameTime, 0),
            set(state.position, divide(add(offsetX, dragX), screenWidth)),
          ],
          cond(
            eq(gestureState, State.END),
            [
              cond(
                and(greaterOrEq(state.position, triggerPosition), eq(isEnabled, 1)),
                [
                  set(config.toValue, 1),
                ],
                cond(
                  and(lessOrEq(state.position, -triggerPosition), eq(isEnabled, 1)),
                  set(config.toValue, -1),
                  [
                    set(config.toValue, 0),
                  ]
                )
              ),
              startClock(clock),
            ]
          )
        ),
        timing(clock, state, config),
        cond(greaterOrEq(abs(state.position), .9), call([], onSwiped)),
        cond(state.finished, stopClock(clock)),
        interpolate(state.position, {
          inputRange: [0, 1],
          outputRange: [0, screenWidth]
        })
      ])
    )
  }

  const recipePosition = positionRecipe(clock, gestureState);

  useEffect(() => {
    isEnabled.setValue(disabled ? 0 : 1);
  }, [disabled])

  return (
    <PanGestureHandler
      onGestureEvent={onRecipeDrag}
      onHandlerStateChange={onRecipeDrag}
      minDist={minDist} >
      <Animated.View {...props} style={[
        {
          transform: [
            { translateX: recipePosition }
          ]
        }
      ]}>
        {props.children}
      </Animated.View >
    </PanGestureHandler >
  )
}

export default Swipeable;
