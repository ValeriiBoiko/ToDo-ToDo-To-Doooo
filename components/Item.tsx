import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Font, Theme as colors } from '../constants';
import { ListItem } from '../types';
import { wp } from '../utils';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props extends ListItem {
  [props: string]: any,
}

function Item({ id, title, isDone, style, ...props }: Props) {
  return (
    <Pressable {...props} style={[styles.item, style]}>
      <View style={[
        styles.checkbox,
        {
          backgroundColor: isDone ? colors.primary : colors.background,
          borderColor: isDone ? colors.primary : colors.border,
        }
      ]}>
        <Icon
          name='done'
          size={wp(24)}
          color={'#f5f5f5'}
          style={{ textAlign: 'center' }} />
      </View>

      <Text style={styles.title}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
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
    fontSize: wp(16),
    padding: 0,
    fontFamily: Font.REGULAR
  }
})

export default Item;
