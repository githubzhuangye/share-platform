import React, { PropTypes } from 'react';
import { Row, Col, Modal, Button } from 'antd';
import * as styles from './styles/homeTips.css';
import classnames from 'classnames';
import HomeDialog, { HomeMessage } from './Data/HomeDialog';


MesgInfo.propTypes = {
  	name: PropTypes.string.isRequired,
  	month: PropTypes.string.isRequired,
  	date: PropTypes.string.isRequired,
  	texts: PropTypes.string.isRequired
};

function MesgInfo({name, month, date, texts}) {
  return (
	<HomeMessage 
		name={name}
		month={month}
		date={date}
		texts={texts}
	/>
  );
}

HomeMesgBox.propTypes = {
  messageList: PropTypes.array.isRequired,
  content: PropTypes.string.isRequired
};


function dateArray(date){
	var dateArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	let num = parseInt(date) - 1;
	return dateArr[num];
}

export default function HomeMesgBox(props) {
  	const { messageList, content } = props;
  	const lists = messageList
    	.map((item, index) =>
        	<MesgInfo
        		key={index}
        		index={index}
        		name={item.title}
		        month={dateArray(item.month)}
		        date={item.date}
		        texts={item.content}
	        />
    );
  return (
    	<Row className={styles.tipsArea}>
      		{lists}
      	</Row>
  );
}





