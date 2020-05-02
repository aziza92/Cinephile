import React from 'react';
import styled from 'styled-components';

const NotificationButton = () => (
  <Container>
    <Image source={require('../Images/bubble_2.png')} />
  </Container>
);

export default NotificationButton;

const Container = styled.View`
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
`;

const Image = styled.Image`
  width: 33px;
  height: 33px;
`;
