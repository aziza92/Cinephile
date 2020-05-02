import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

class PostDesign extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.card}>
        <Text style={styles.name}>{this.props.posterName}</Text>
        <Text style={styles.time}>{this.props.postTime}</Text>
        <Text style={styles.content}>{this.props.postContent}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 3,
    backgroundColor: '#F3F2F2',

    shadowColor: '#111',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    paddingBottom: 10,
  },
  content: {
    color: 'rgba(0,0,0,.9)',
    fontSize: 14,
  },
});

export default PostDesign;
