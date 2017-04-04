import React, { Component } from 'react';

import { LoginFormContainer } from 'containers/home';
import { Carousel, Timeline, MainWrapper } from 'components/home';

export default class Home extends Component {
  render() {
    return (
      <MainWrapper>
        <div>
          <Carousel>
            <LoginFormContainer/>
          </Carousel>
          <Timeline/>
        </div>
      </MainWrapper>
    );
  }
}
