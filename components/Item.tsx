import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Font } from '../constants';
import { ColorTheme, ListItem, RootState } from '../types';
import { wp } from '../utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

interface Props extends ListItem {
  colors: ColorTheme,
  [props: string]: any,
}

function Item({ id, title, isDone, style, colors, ...props }: Props) {
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <Pressable {...props} style={[styles.item, style]}>
      <View style={[
        styles.checkbox,
        {
          backgroundColor: isDone ? colors.primary : colors.background,
          borderColor: isDone ? colors.primary : colors.border,
        }
      ]}>
        {
          isDone && (
            <Icon
              name='done'
              size={wp(24)}
              color={'#f5f5f5'}
              style={{ textAlign: 'center' }} />
          )
        }
      </View>

      <Text style={styles.title}>{title}</Text>
    </Pressable>
  )
}

const getStyles = (colors: ColorTheme) => StyleSheet.create({
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
    color: colors.text,
    padding: 0,
    fontFamily: Font.REGULAR
  }
})

const mapStateToProps = (state: RootState) => ({
  colors: state.theme,
});

export default connect(mapStateToProps)(Item);
