import React from 'react';
import styled from 'styled-components';
import {
  PanResponder,
  Animated,
  Alert,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {getNewFilmFromApi} from '../API/TMDBApi';
import Project from './Project';

function mapStateToProps(state) {
  return {
    action: state.action,
  };
}
const LENGTH = 3;

function getNextIndex(index) {
  var nextIndex = index + 1;
  if (nextIndex > LENGTH - 1) {
    return 0;
  }
  return nextIndex;
}

class Card extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      projects: [
        {title: '', date: '', image: ''},
        {title: '', date: '', image: ''},
        {title: '', date: '', image: ''},
      ],
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(0.9),
      translateY: new Animated.Value(44),
      thirdScale: new Animated.Value(0.8),
      thridTranslateY: new Animated.Value(-50),
      index: 0,
      opacity: new Animated.Value(0),
    };
  }

  UNSAFE_componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => {
        if (gestureState.dx === 0 && gestureState.dy === 0) {
          return false;
        } else {
          if (this.props.action === 'openCard') {
            return false;
          } else {
            return true;
          }
        }
      },

      onPanResponderGrant: () => {
        Animated.spring(this.state.scale, {toValue: 1}).start();
        Animated.spring(this.state.translateY, {toValue: 0}).start();

        Animated.spring(this.state.thirdScale, {toValue: 0.9}).start();
        Animated.spring(this.state.thridTranslateY, {toValue: 44}).start();

        Animated.timing(this.state.opacity, {toValue: 1}).start();
      },

      onPanResponderMove: Animated.event([
        null,
        {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: () => {
        const positionY = this.state.pan.y.__getValue();

        Animated.timing(this.state.opacity, {toValue: 0}).start();

        if (positionY > 200) {
          Animated.timing(this.state.pan, {
            toValue: {x: 0, y: 1000},
          }).start(() => {
            this.state.pan.setValue({x: 0, y: 0});
            this.state.scale.setValue(0.9);
            this.state.translateY.setValue(44);
            this.state.thridTranslateY.setValue(0.8);
            this.state.thridTranslateY.setValue(-50);
            this.setState({index: getNextIndex(this.state.index)});
          });
        } else {
          Animated.spring(this.state.pan, {toValue: {x: 0, y: 0}}).start();

          Animated.spring(this.state.scale, {toValue: 0.9}).start();
          Animated.spring(this.state.translateY, {toValue: 44}).start();

          Animated.spring(this.state.thirdScale, {toValue: 0.8}).start();
          Animated.spring(this.state.thridTranslateY, {toValue: -50}).start();
        }
      },
    });
  }
  componentDidMount() {
    const handleResponse = data => {
      const title = data.results[0].title;
      const title1 = data.results[1].title;
      const title2 = data.results[2].title;
      const image = data.results[0].poster_path;
      const image1 = data.results[1].poster_path;
      const image2 = data.results[2].poster_path;
      const date = data.results[0].release_date;
      const date1 = data.results[1].release_date;
      const date2 = data.results[2].release_date;
      const desc = data.results[0].overview;
      const desc1 = data.results[1].overview;
      const desc2 = data.results[2].overview;

      // assuming you just want to update
      // the first item in the `projects` array
      const nextProjects = [...this.state.projects];
      nextProjects[0].title = title;
      nextProjects[1].title = title1;
      nextProjects[2].title = title2;
      nextProjects[0].image = image;
      nextProjects[1].image = image1;
      nextProjects[2].image = image2;
      nextProjects[0].date = date;
      nextProjects[1].date = date1;
      nextProjects[2].date = date2;
      nextProjects[0].desc = desc;
      nextProjects[1].desc = desc1;
      nextProjects[2].desc = desc2;

      this.setState({
        projects: nextProjects,
        isLoading: true,
      });
    };
    //console.log(this.state.projects);
    const handleError = err => {
      this.setState({
        apiError: true,
        isLoading: false,
      });
    };

    getNewFilmFromApi({isLoading: true})
      .then(handleResponse)
      .catch(handleError);
  }
  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  }
  render() {
    const {projects} = this.state;

    return (
      <Container>
        {this._displayLoading()}
        <AnimatedMask style={{opacity: this.state.opacity}} />
        <Animated.View
          style={{
            transform: [
              {translateX: this.state.pan.x},
              {translateY: this.state.pan.y},
            ],
          }}
          {...this._panResponder.panHandlers}>
          <Project
            title={projects[this.state.index].title}
            image={projects[this.state.index].image}
            date={projects[this.state.index].date}
            desc={projects[this.state.index].desc}
            canOpen={true}
          />
        </Animated.View>

        <Animated.View
          style={{
            top: 230,
            left: 0,
            zIndex: -1,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [
              {scale: this.state.scale},
              {translateY: this.state.translateY},
            ],
          }}>
          <Project />
        </Animated.View>
        <Animated.View
          style={{
            top: 240,
            left: 0,
            zIndex: -2,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [
              {scale: this.state.thirdScale},
              {translateY: this.state.thridTranslateY},
            ],
          }}>
          <Project />
        </Animated.View>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(Card);

const Mask = styled.View`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  z-index: -3;
`;

const AnimatedMask = Animated.createAnimatedComponent(Mask);

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #f0f3f5;
  margin-top: 50px;
`;

const Text = styled.Text``;
const styles = StyleSheet.create({
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
