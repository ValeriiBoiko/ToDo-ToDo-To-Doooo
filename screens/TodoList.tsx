import React, { useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Font } from '../constants';
import { ColorTheme, ListItem, RootState } from '../types';
import { wp } from '../utils';
import Item from '../components/Item';
import { updateItemAction } from '../actions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NewItemInput from '../components/NewItemInput';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  list: ListItem[],
  colors: ColorTheme,
  [props: string]: any
};

function TodoList({ list, colors, ...props }: Props) {
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const addItemRef = useRef<TextInput>(null);

  const onAddItem = () => {
    if (addItemRef && addItemRef.current) {
      addItemRef.current.focus();
    }
  }

  const items = list.map((item) => (
    <Item
      {...item}
      key={item.id}
      style={styles.item}
      onPress={() => props.updateItem({
        ...item,
        isDone: !item.isDone,
      })}
    />
  ))

  return (
    <>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }
      ]}>
        {items}

        <Pressable onPress={onAddItem} style={styles.addItem}>
          <Icon name={'add'} size={wp(28)} color={colors.primary} />
          <Text style={styles.addItemLabel}>Add item</Text>
        </Pressable>

      </ScrollView>
      <NewItemInput ref={addItemRef} />
    </>
  )
}

const getStyles = (colors: ColorTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: wp(20),
  },
  item: {
    marginBottom: wp(10),
  },
  addItem: {
    padding: wp(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  addItemLabel: {
    fontSize: wp(18),
    fontFamily: Font.BOLD,
    lineHeight: wp(18),
    color: colors.primary,
  }
})

const mapStateToProps = (state: RootState) => ({
  list: state.list,
  colors: state.theme
});

const mapStateTopRops = (dispatch: Function) => ({
  updateItem: (item: ListItem) => dispatch(updateItemAction(item))
})

export default connect(mapStateToProps, mapStateTopRops)(TodoList);
