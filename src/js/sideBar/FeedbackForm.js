import React from 'react';
import "../../css/feedback.css";

export default class FeedbackForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            newFeedbackText: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFeedbackTextChange = this.handleFeedbackTextChange.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();

        this.props.firebaseSaveFeedback(this.state.newFeedbackText);
        this.props.toggleFeedback();

        this.setState(state => ({
            newFeedbackText: "",
        }));
    }

    handleFeedbackTextChange(e){
        this.setState({ newFeedbackText: e.target.value });
    }

    render() {
        return (
            <form
                autoComplete="off"
            >
                <textarea
                   className={"feedbackTextArea"}
                    name="feedbackText"
                    rows="5"
                    cols="30"
                    autoFocus
                    placeholder="what would you change?"
                    onChange={this.handleFeedbackTextChange}
                    value={this.state.newFeedbackText}
                />
                <br/>
                <div
                    onClick={this.handleSubmit}
                    className={"sideBarElementButton"}
                >submit</div>
            </form>
        );
    }
}