import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { wp } from '../utils';

interface Props {
  trackColor?: string,
  onThumbColor?: string,
  offThumbColor?: string,
  isOn: boolean,
  onToggle: (isOn: boolean) => void,
  style?: object,
};

function Toggle({ isOn, trackColor, onThumbColor, offThumbColor, onToggle, style }: Props) {
  const animatedValue = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  const runAnimation = (targetValue: number) => {
    Animated.timing(
      animatedValue,
      {
        toValue: targetValue,
        duration: 200,
        easing: Easing.bezier(.43, 0, .55, 1),
        useNativeDriver: true,
      }
    ).start();
  };

  useEffect(() => {
    if (isOn) {
      runAnimation(1);
    } else {
      runAnimation(0);
    }
  }, [isOn])

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, wp(30)],
  })

  return (
    <Pressable style={[
      styles.toggle,
      {
        backgroundColor: trackColor,
        ...style
      }
    ]}
      onPress={() => onToggle(!isOn)}
    >
      <Animated.View style={[
        styles.thumb,
        {
          borderColor: trackColor,
          backgroundColor: isOn ? onThumbColor : offThumbColor,
          transform: [
            { translateX: thumbPosition }
          ]
        }
      ]}></Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  toggle: {
    height: wp(30),
    borderRadius: wp(30),
    width: wp(60),
  },
  thumb: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    borderWidth: wp(4),
    position: 'absolute',
  }
});

Toggle.defaultProps = {
  trackColor: '#000',
  onThumbColor: '#fff',
  offThumbColor: '#fff',
  defaultValue: 'off',
}

export default Toggle;
