import React, {
  useState, useEffect, ReactElement,
} from 'react';
import { connect } from 'react-redux';

import { addMainData } from '../redux/actions';
import {
  MainInt, MainCharacterInt, MainWordInt, ReactFullState,
} from '../interfaces';
import Addition from '../components/Addition';
import Strip from '../components/Strip';

interface ReactProps {
  token: string,
  mainData: MainInt,
  addMainData: (
    word: string,
    object: MainCharacterInt | MainWordInt,
    ) => any,
}

const AdditionCont: React.FC<ReactProps> = (props): ReactElement => {
  // setting up user status
  const [mainData, setMainData] = useState<MainInt | null>(props.mainData);

  useEffect(() => {
    setMainData(props.mainData);
  }, [props.mainData]);

  // Functions for data upload when next character is added to DB
  const uploadNewWord = (word: string, object: MainCharacterInt | MainWordInt) => {
    props.addMainData(word, object);
  };

  let content;

  if (mainData) {
    content = (
      <Addition
        mainData={mainData}
        uploadNewWord={uploadNewWord}
      />
    );
  } else if (!props.token) {
    content = <Strip message="No user is signed in" timeout={4000} />;
  } else {
    content = <Strip message="Loading..." />;
  }

  return (
    <div>
      {content}
    </div>
  );
};

const mapStateToProps = (state: ReactFullState) => ({
  token: state.auth.token,
  mainData: state.data.mainData,
});

export default connect(
  mapStateToProps,
  { addMainData },
)(AdditionCont);
