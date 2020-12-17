import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { ListItem, RootState } from '../types';
import { wp } from '../utils';

interface Props {
  list: ListItem[],
};

function TodoList({ list, ...props }: Props) {
  return (
    <View>
      {
        list.map((item) => {
          return (
            <View key={item.id} style={styles.item}>
              <View style={[
                styles.checkbox,
                {
                  backgroundColor: item.isDone ? 'green' : 'red',
                }
              ]} />

              <Text style={styles.title}>{item.title}</Text>
            </View>
          )
        })
      }
    </View>
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
  },
  title: {
    fontSize: wp(16),
    padding: 0,
  }
})

const mapStateToProps = (state: RootState) => ({
  list: state.list
});

export default connect(mapStateToProps)(TodoList);
