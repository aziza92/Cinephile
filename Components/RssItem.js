import React from 'react';
import styled from 'styled-components';
import {StyleSheet, View, Text, Image} from 'react-native';

import rssParser from 'react-native-rss-parser';

class RssItem extends React.Component {
  state = {
    feed: [],
    description0: [],
    title0: [],
    copyright: [],
    items: [],
    image: [],
  };

  fetchRSSFeed() {
    return fetch('https://cinema.jeuxactu.com/filmsactu-news.rss')
      .then(response => response.text())
      .then(responseData => rssParser.parse(responseData))
      .then(rss => {
        //console.log(rss.items.length);

        this.setState(prevState => ({
          ...prevState,

          title: rss.items[0].title,
          title1: rss.items[1].title,
          title2: rss.items[2].title,
          title3: rss.items[3].title,
          title4: rss.items[4].title,
          title5: rss.items[5].title,
          description: rss.items[0].description,
          description1: rss.items[1].description,
          description2: rss.items[2].description,
          description3: rss.items[3].description,
          description4: rss.items[4].description,
          description5: rss.items[5].description,
          image: rss.items[0].enclosures,
          image1: rss.items[1].enclosures,
          image2: rss.items[2].enclosures,
          image3: rss.items[3].enclosures,
          image4: rss.items[4].enclosures,
          image5: rss.items[5].enclosures,
        }));
      });
  }

  render() {
    {
      this.fetchRSSFeed();
    }
    return (
      <Container1>
        <Container>
          <Text style={styles.title_text}>{this.state.title}</Text>
          <View style={styles.main_container}>
            <Image style={styles.image} source={this.state.image} />
            <View style={styles.content_container}>
              <View style={styles.description_container}>
                <Text style={styles.description_text} numberOfLines={6}>
                  {this.state.description}
                </Text>
              </View>
            </View>
          </View>
        </Container>
        <Container>
          <Text style={styles.title_text}>{this.state.title1}</Text>
          <View style={styles.main_container}>
            <Image style={styles.image} source={this.state.image1} />
            <View style={styles.content_container}>
              <View style={styles.description_container}>
                <Text style={styles.description_text} numberOfLines={6}>
                  {this.state.description1}
                </Text>
              </View>
            </View>
          </View>
        </Container>
        <Container>
          <Text style={styles.title_text}>{this.state.title2}</Text>
          <View style={styles.main_container}>
            <Image style={styles.image} source={this.state.image2} />
            <View style={styles.content_container}>
              <View style={styles.description_container}>
                <Text style={styles.description_text} numberOfLines={6}>
                  {this.state.description2}
                </Text>
              </View>
            </View>
          </View>
        </Container>
        <Container>
          <Text style={styles.title_text}>{this.state.title3}</Text>
          <View style={styles.main_container}>
            <Image style={styles.image} source={this.state.image3} />
            <View style={styles.content_container}>
              <View style={styles.description_container}>
                <Text style={styles.description_text} numberOfLines={6}>
                  {this.state.description3}
                </Text>
              </View>
            </View>
          </View>
        </Container>
        <Container>
          <Text style={styles.title_text}>{this.state.title4}</Text>
          <View style={styles.main_container}>
            <Image style={styles.image} source={this.state.image4} />
            <View style={styles.content_container}>
              <View style={styles.description_container}>
                <Text style={styles.description_text} numberOfLines={6}>
                  {this.state.description4}
                </Text>
              </View>
            </View>
          </View>
        </Container>
        <Container>
          <Text style={styles.title_text}>{this.state.title5}</Text>
          <View style={styles.main_container}>
            <Image style={styles.image} source={this.state.image5} />
            <View style={styles.content_container}>
              <View style={styles.description_container}>
                <Text style={styles.description_text} numberOfLines={6}>
                  {this.state.description5}
                </Text>
              </View>
            </View>
          </View>
        </Container>
      </Container1>
    );
  }
}
export default RssItem;
const styles = StyleSheet.create({
  main_container: {
    height: 200,
    flexDirection: 'row',
    marginTop: 3,
  },
  image: {
    width: 100,
    height: 140,
    margin: 2,
    marginLeft: 4,
    backgroundColor: 'gray',
    borderRadius: 100,
  },
  content_container: {
    flex: 1,
    margin: 5,
  },
  header_container: {
    flex: 3,
    flexDirection: 'row',
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
  },

  description_container: {
    flex: 7,
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666',
  },
});

const Container1 = styled.View`
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  z-index: 100;
  background: #f0f3f5;
  margin-top: 80px;
`;
const Container = styled.View`
  background-color: white;
  width: 100%;
  height: 70%;
  border-radius: 14px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  margin-top: 20px;
  left: 0;
`;
