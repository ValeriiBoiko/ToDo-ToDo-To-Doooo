import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Font } from '../constants';
import { ColorTheme, ListItem, RootState } from '../types';
import { wp } from '../utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

interface Props extends ListItem {
  colors: ColorTheme,
  [props: string]: any,
}

function Item({ id, title, isDone, note, isDaily, style, colors, onPress, ...props }: Props) {
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

  return (
    <Animated.View {...props} style={[
      styles.container, style,
      { height: containerHeight }
    ]}>
      <View style={styles.item} onLayout={({ nativeEvent }) => {
        setItemHeight(nativeEvent.layout.height);
      }}>

        <Pressable style={{ flex: 1, ...styles.item }} onPress={onPress}>
          <View style={[
            styles.checkbox,
            {
              backgroundColor: isDone ? colors.primary : colors.background,
              borderColor: isDone ? colors.primary : colors.border,
            }
          ]}>
            {isDone && <Icon name='done' size={wp(24)} color={'#f5f5f5'} />}
          </View>

          <Text style={styles.title}>{title}</Text>

          {
            isDaily && (
              <View>
                <Icon name='date-range' size={wp(28)} color={colors.border} />
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
  )
}

const getStyles = (colors: ColorTheme) => StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.background
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(40),
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
  note: {
    position: 'absolute',
    paddingLeft: wp(50),
    paddingTop: wp(8),
    fontSize: wp(16),
    lineHeight: wp(24),
    color: colors.text,
    opacity: .7,
    fontFamily: Font.REGULAR
  }
})

const mapStateToProps = (state: RootState) => ({
  colors: state.theme,
});

export default connect(mapStateToProps)(Item);
