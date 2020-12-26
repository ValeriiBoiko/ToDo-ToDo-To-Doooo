import React, { useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Font } from '../constants';
import { ColorTheme, ListItem, RootState } from '../types';
import { wp } from '../utils';
import Item from '../components/Item';
import { deleteItemAction, updateItemAction } from '../actions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NewItemInput from '../components/NewItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../components/Touchable';
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated';
import ContextMenu from '../components/ContextMenu';

interface Props {
  list: ListItem[],
  colors: ColorTheme,
  deleteItem: (item: ListItem) => Function,
  updateItem: (item: ListItem) => Function,
  [props: string]: any
};

function TodoList({ list, colors, deleteItem, updateItem, ...props }: Props) {
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const addItemRef = useRef<TextInput>(null);
  const sorteredList = list.concat([]);
  const [activeItem, setActiveItem] = useState<ListItem | null>(null);
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { x: 0, y: 0, }
  })
  sorteredList.sort((cur, next) => !cur.isDone ? -1 : 1);
  const transitioningRef = useRef<TransitioningView>(null);
  const transition = (
    <Transition.Together>
      <Transition.In interpolation={'easeInOut'} durationMs={100} />
      <Transition.Out interpolation={'easeInOut'} durationMs={100} />
      <Transition.Change interpolation={'easeInOut'} durationMs={350} />
    </Transition.Together>
  )

  const onAddItem = () => {
    if (addItemRef && addItemRef.current) {
      addItemRef.current.focus();
    }
  }

  const onItemPress = (item: ListItem, { nativeEvent }: GestureResponderEvent): void => {
    if (transitioningRef && transitioningRef.current) {
      transitioningRef.current.animateNextTransition();
    }
    updateItem({
      ...item,
      isDone: !item.isDone,
    })
  }

  const onItemLongPress = (item: ListItem, { nativeEvent }: GestureResponderEvent): void => {
    setActiveItem(item);
    setContextMenu({
      isVisible: true,
      position: {
        x: nativeEvent.pageX,
        y: nativeEvent.pageY,
      }
    })
  }

  const onRequestMenuClose = (): void => {
    setActiveItem(null);
    setContextMenu({
      ...contextMenu,
      isVisible: false,
    })
  }

  const onDeleteItem = (): void => {
    if (activeItem) {
      transitioningRef.current?.animateNextTransition();
      deleteItem(activeItem)
    };
    setTimeout(() => {
      setContextMenu({
        ...contextMenu,
        isVisible: false,
      })
    }, 150)
  }

  const items = sorteredList.map((item) => (
    <Item
      {...item}
      key={item.id}
      style={{
        padding: wp(5),
        borderRadius: wp(8),
        backgroundColor: activeItem && item.id === activeItem.id ? colors.card : colors.background,
      }}
      onPress={(event: GestureResponderEvent) => onItemPress(item, event)}
      onLongPress={(event: GestureResponderEvent) => onItemLongPress(item, event)}
    />
  ))

  return (
    <>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top || wp(15),
          paddingBottom: insets.bottom,
        }
      ]}>

        <Transitioning.View ref={transitioningRef} transition={transition}>
          {items}

          <Touchable
            onPress={onAddItem}
            style={styles.addItem}
            activeOpacity={.7}
            rippleColor={'rgba(255,255,255,.25)'} >
            <Icon name={'add'} size={wp(28)} color={colors.invertedText} />
            <Text style={styles.addItemLabel}>Add item</Text>
          </Touchable>
        </Transitioning.View>
      </ScrollView>

      <NewItemInput onAdded={() => transitioningRef.current?.animateNextTransition()} ref={addItemRef} />

      <ContextMenu
        {...contextMenu}
        items={[
          {
            label: 'Delete',
            onPress: onDeleteItem,
            icon: {
              color: '#ff5252',
              name: 'delete-outline'
            },
          }
        ]}
        onRequestClose={onRequestMenuClose}
        backgroundColor={colors.background} />
    </>
  )
}

const getStyles = (colors: ColorTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: wp(15),
  },
  item: {
    marginBottom: wp(10),
  },
  addItem: {
    marginTop: wp(12),
    padding: wp(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: wp(8),
  },
  addItemLabel: {
    fontSize: wp(18),
    fontFamily: Font.BOLD,
    lineHeight: wp(18),
    color: colors.invertedText,
  }
})

const mapStateToProps = (state: RootState) => ({
  list: state.list,
  colors: state.theme
});

const mapStateTopRops = (dispatch: Function) => ({
  updateItem: (item: ListItem) => dispatch(updateItemAction(item)),
  deleteItem: (item: ListItem) => dispatch(deleteItemAction(item))
})

export default connect(mapStateToProps, mapStateTopRops)(TodoList);
