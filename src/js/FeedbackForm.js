import React from 'react';

export default class DayStats extends React.Component {

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
        return (<div>
        <form
            onSubmit={this.handleSubmit}
            autoComplete="off"
        >
            <textarea
                name="feedbackText"
                rows="10"
                cols="30"
                placeholder="what would you change?"
                onChange={this.handleFeedbackTextChange}
                value={this.state.newFeedbackText}
            />
            <br/>
            <input
                type="submit"
                value="submit"
            />
        </form>
            </div>
        );
    }
}