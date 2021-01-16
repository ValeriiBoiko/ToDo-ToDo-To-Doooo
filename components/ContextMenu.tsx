import React, { useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View, ViewProps } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Font } from '../constants';
import { wp } from '../utils';
import Touchable from './Touchable';

interface ContextMenuItem {
  icon?: {
    color: string,
    name: string
  },
  label: string,
  onPress: (e?: any) => void,
}

interface Props extends ViewProps {
  isVisible: boolean,
  backgroundColor: string,
  textColor: string,
  items: ContextMenuItem[],
  onCloseRequest: () => void,
  children: Element | Element[],
  position: {
    x: number,
    y: number,
  }
}

function ContextMenu({ isVisible, items, position, onCloseRequest, backgroundColor, textColor, children, ...props }: Props) {
  const [layout, setLayout] = useState({ x: 0, y: 0 });
  const screen = Dimensions.get('window');
  const left = position.x > screen.width - wp(170) ? screen.width - wp(170) : position.x
  const top = position.y > screen.height - items.length * wp(40) ? screen.height - items.length * wp(40) : position.y

  return (
    <View {...props} onLayout={({ nativeEvent }) => setLayout(nativeEvent.layout)}>
      {children}

      {isVisible ? (
        <Pressable onPress={onCloseRequest}
          style={StyleSheet.absoluteFill}>
          <View
            style={{
              position: 'absolute',
              overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
              left: left,
              top: top - layout.y,
              backgroundColor: backgroundColor,
              borderRadius: wp(8),
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            {
              items.map((item, index) => (
                <Touchable style={styles.item} key={index} onPress={item.onPress}>
                  {item.icon && <Icon size={wp(24)} {...item.icon} />}
                  <Text style={[
                    styles.itemLabel,
                    { color: textColor }
                  ]}>{item.label}</Text>
                </Touchable>
              ))
            }
          </View>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: wp(12),
    paddingRight: wp(20),
    width: wp(170),
    height: wp(40),
  },
  itemLabel: {
    paddingLeft: wp(4),
    lineHeight: wp(24),
    fontSize: wp(16),
    fontFamily: Font.REGULAR,
  }
});

ContextMenu.defaultProps = {
  backgroundColor: '#fff',
  textColor: '#000',
}

export default ContextMenu;
