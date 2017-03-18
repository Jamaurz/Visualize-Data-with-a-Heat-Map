import React from 'react';
import { connect } from "react-redux"

import { addArray } from "../actions/commonAction"
import './Layout.sass';

@connect((store) => {
    console.log(store);
    return {
        array: store.common.array,
    };
})
export default class Layout extends React.Component {
    componentWillMount() {
        this.props.dispatch(addArray('sina'))
    }
    addRandomItem() {
        let value = Math.ceil(Math.random() * 10);
        console.log(value);
        this.props.dispatch(addArray(value))
    }
    render() {
        return (
           <div>
               <h1 onClick={this.addRandomItem.bind(this)}>Add random item to list</h1>
               <ul>
                   {this.props.array.map((el) => {
                       return <li>{el}</li>
                   })}
               </ul>
           </div>
        )
    }
}