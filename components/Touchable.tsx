import React, { ReactNode } from 'react';
import { Platform, TouchableNativeFeedback, TouchableNativeFeedbackProps, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface Props extends TouchableOpacityProps, TouchableNativeFeedbackProps {
  rippleColor: string,
  children?: ReactNode
};

function Touchable({ style, children, rippleColor, ...props }: Props) {
  if (Platform.OS == 'ios') {
    return (
      <TouchableOpacity {...props}>
        {children}
      </TouchableOpacity>
    )
  } else {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(rippleColor, false)}
        {...props}>
        <View style={style}>
          {children}
        </View>
      </TouchableNativeFeedback>
    )
  }
}

Touchable.defaultProps = {
  rippleColor: '#fff',
}

export default Touchable;
