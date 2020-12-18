import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Font, Theme as colors } from '../constants';
import { ColorTheme, ListItem, RootState } from '../types';
import { wp } from '../utils';
import Item from '../components/Item';
import { updateItemAction } from '../actions';

interface Props {
  list: ListItem[],
  [props: string]: any
};

function TodoList({ list, ...props }: Props) {
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {
          list.map((item) => (
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
        }
      </View>
    </SafeAreaView>
  )
}

const getStyles = (colors: ColorTheme) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: wp(20),
  },
  item: {
    marginBottom: wp(10),
  }
})

const mapStateToProps = (state: RootState) => ({
  list: state.list
});

const mapStateTopRops = (dispatch: Function) => ({
  updateItem: (item: ListItem) => dispatch(updateItemAction(item))
})

export default connect(mapStateToProps, mapStateTopRops)(TodoList);
