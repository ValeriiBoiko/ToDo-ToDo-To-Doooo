import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, GestureResponderEvent, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { batch, connect } from 'react-redux';
import { Font } from '../constants';
import { ColorTheme, ListItem, RootState } from '../types';
import { wp, wpdp } from '../utils';
import Item from '../components/Item';
import { deleteItemAction, updateItemAction } from '../actions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NewItemInput from '../components/NewItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../components/Touchable';
import Animated, { block, call, Clock, cond, Easing, eq, event, interpolate, set, startClock, stopClock, timing, Transition, Transitioning, TransitioningView, Value } from 'react-native-reanimated';
import ContextMenu from '../components/ContextMenu';
import { State, TapGestureHandler } from 'react-native-gesture-handler';

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
  const sorteredList = list.concat([]).sort((cur, next) => cur.isDone ? 1 : -1);;
  const [activeItem, setActiveItem] = useState<ListItem | null>(null);
  const transitioningRef = useRef<TransitioningView>(null);
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { x: 0, y: 0, }
  })

  const onAddItem = () => {
    if (addItemRef && addItemRef.current) {
      addItemRef.current.focus();
    }
  };

  const toggleItem = (item: ListItem): void => {
    if (transitioningRef && transitioningRef.current) {
      transitioningRef.current.animateNextTransition();
    }
    updateItem({
      ...item,
      updated: new Date(),
      isDone: !item.isDone,
    })
  };

  const showItemContextMenu = (item: ListItem, { nativeEvent }: GestureResponderEvent): void => {
    setActiveItem(item);
    setContextMenu({
      isVisible: true,
      position: {
        x: nativeEvent.pageX,
        y: nativeEvent.pageY,
      }
    })
  };

  const onCloseMenuRequest = (): void => {
    setActiveItem(null);
    setContextMenu({
      ...contextMenu,
      isVisible: false,
    })
  };

  const onDeleteItem = (): void => {
    if (activeItem) {
      transitioningRef.current?.animateNextTransition();
      deleteItem(activeItem);
    };

    setTimeout(onCloseMenuRequest, 150)
  };

  const items = sorteredList.map((item) => (
    <Item
      {...item}
      key={item.id}
      style={{
        padding: wp(5),
        borderRadius: wp(8),
        backgroundColor: activeItem && item.id === activeItem.id ? colors.card : colors.background,
      }}
      onPress={() => toggleItem(item)}
      onLongPress={(event: GestureResponderEvent) => showItemContextMenu(item, event)}
    />
  ));

  useEffect(() => {
    if (colors.background > '#777') {
      StatusBar.setBarStyle('dark-content');
    } else {
      StatusBar.setBarStyle('light-content');
    }
  }, [colors]);

  useEffect(() => {
    setTimeout(() => {
      const date = new Date();

      if (transitioningRef && transitioningRef.current) {
        transitioningRef.current.animateNextTransition();
      }

      batch(() => {
        sorteredList.forEach((item) => {
          if (item.isDaily && item.updated && new Date(item.updated).getDate() !== date.getDate()) {
            updateItem({
              ...item,
              updated: date,
              isDone: false,
            })
          }
        })
      })
    }, 500)
  }, [])

  const runOpacity = (clock: Clock, gestureState: Value<number>) => {
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
        state.finished, [
        stopClock(clock),
        cond(
          eq(config.toValue, 1),
          [
            set(config.toValue, 0),
            set(state.position, -1),
            call([], onAddItem),
          ],
          [
            cond(
              eq(config.toValue, -1),
              [set(config.toValue, 0), set(state.position, -1),],
              [set(config.toValue, 1), set(state.position, 0),],
            )
          ],

        )
      ]),
      state.position
    ])
  };

  const gestureState = useRef(new Value(-1)).current;
  const clock = useRef<Clock>(new Clock()).current;

  const onTap = event([
    {
      nativeEvent: {
        state: gestureState
      }
    }
  ]);

  const fireTapEvent = () => {
    gestureState.setValue(State.BEGAN);
    setTimeout(() => {
      gestureState.setValue(State.END);
    }, 48)
  };

  const animation = runOpacity(clock, gestureState);

  const opacity = interpolate(animation, {
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0]
  });

  const size = interpolate(animation, {
    inputRange: [-1, 0, 1],
    outputRange: [wpdp(0), wpdp(35), Dimensions.get('window').width]
  });


  return (
    <>
      <ContextMenu
        style={{ flex: 1 }}
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
        textColor={colors.text}
        backgroundColor={colors.background}
        onCloseRequest={onCloseMenuRequest}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top || wp(15),
            paddingBottom: insets.bottom,
          }
        ]}>

          <Transitioning.View
            ref={transitioningRef}
            transition={(
              <Transition.Together>
                <Transition.In interpolation={'easeInOut'} durationMs={100} />
                <Transition.Out interpolation={'easeInOut'} durationMs={100} />
                <Transition.Change interpolation={'easeInOut'} durationMs={350} />
              </Transition.Together>
            )}
            style={{ flex: 1, }}>
            {items}

            {
              list.length ? (
                <Touchable
                  onPress={onAddItem}
                  style={styles.addItem}
                  activeOpacity={.7}
                  rippleColor={'rgba(255,255,255,.25)'} >
                  <Icon name={'add'} size={wp(28)} color={colors.invertedText} />
                  <Text style={styles.addItemLabel}>Add item</Text>
                </Touchable>
              ) : (
                  <View style={styles.emptyListWrapper}>
                    <TapGestureHandler onHandlerStateChange={onTap} >
                      <Animated.View
                        style={[
                          styles.emptyListButton,
                          {
                            opacity: opacity,
                            width: size,
                            height: size,
                            borderRadius: size,
                          }
                        ]}
                      >
                        <Icon name={'add'} size={wp(45)} color={colors.invertedText} />
                      </Animated.View>
                    </TapGestureHandler>
                  </View>
                )
            }
          </Transitioning.View>
        </ScrollView>

        <NewItemInput
          ref={addItemRef}
          onCancelled={fireTapEvent}
          onAdded={() => transitioningRef.current?.animateNextTransition()}
        />
      </ContextMenu>
    </>
  )
}

const getStyles = (colors: ColorTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: wp(15),
  },
  emptyListWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: wp(3),
    borderColor: colors.primary,
  },
  item: {
    marginBottom: wp(10),
  },
  addItem: {
    marginTop: wp(12),
    marginHorizontal: wp(4),
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
