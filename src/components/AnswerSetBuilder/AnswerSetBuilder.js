import React, { useState, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import NewAnswerDialog from '../NewAnswerDialog/NewAnswerDialog';
import BulkAnswerDialog from '../BulkAnswerDialog/BulkAnswerDialog';

const styles = (theme) => ({
    sectionTitle: {
        margin: 15,
    },
    paper: {
        margin: 15,
    },
});

/**
 * @version 2022-11-16
 * @desctiption Builds user answer set response.
 * @returns AnswerSetBuilder component
 */
const AnswerSetBuilder = (props) => {
    const [state, setState] = useState({
        answerDialogOpen: false,
        bulkDialogOpen: false,
        selectedAnswerIndex: null,
    })

    const resetState = () => {
        setState(
            {
                answerDialogOpen: false,
                bulkDialogOpen: false,
                selectedAnswerIndex: null,
            }
        );
    };

    const handleOpenAnswerDialog = () => {
        setState(
            {
                answerDialogOpen: true,
                bulkDialogOpen: state.bulkDialogOpen,
                selectedAnswerIndex: state.selectedAnswerIndex,
            }
        );
    };

    const handleAnswerCancel = () => {
        setState(
            {
                answerDialogOpen: false,
                bulkDialogOpen: state.bulkDialogOpen,
                selectedAnswerIndex: null
            }
        );
    };

    const handleAnswerAdd = (input) => {
        const { selectedAnswerIndex } = state;
        const { answers, onAnswerAdd } = props;
        if (selectedAnswerIndex !== null) {
            answers[selectedAnswerIndex] = input;
        } else {
            answers.push(input);
        }
        onAnswerAdd(answers);
        setState(
            {
                answerDialogOpen: false,
                bulkDialogOpen: state.bulkDialogOpen,
                selectedAnswerIndex: null,
            }
        );
    };

    const handleAnswerClick = (index) => () => {
        setState(
            {
                answerDialogOpen: true,
                bulkDialogOpen: state.bulkDialogOpen,
                selectedAnswerIndex: index,
            }
        );
    };

    const handleBulkAnswerClick = () => {
        setState({
            answerDialogOpen: state.answerDialogOpen,
            bulkDialogOpen: true,
            selectedAnswerIndex: state.selectedAnswerIndex,
        });
    };

    const handleBulkClose = () => {
        setState({
            answerDialogOpen: state.answerDialogOpen,
            bulkDialogOpen: false,
            selectedAnswerIndex: state.selectedAnswerIndex,
        });
    };

    renderAnswerList = () => {
        const { classes, answers } = this.props;
        return answers.length > 50 ? (
            <ListItem button onClick={this.handleBulkAnswerClick}>
                <ListItemText primary="Click to view full answer set" />
            </ListItem>
        ) : answers.length ? (
            answers.map((answer, index) => {
                return (
                    <div key={index}>
                        {index > 0 ? <Divider /> : null}
                        <ListItem button onClick={this.handleAnswerClick(index)}>
                            <ListItemText primary={answer.primary} />
                        </ListItem>
                    </div>
                );
            })
        ) : (
            <ListItem>
                <ListItemText className={classes.noAnswers} primary="No answers added." />
            </ListItem>
        );
    };

    render() {
        const { answerDialogOpen, bulkDialogOpen, selectedAnswerIndex } = this.state;
        const { classes, answers, globalSecondaryFields } = this.props;
        const selectedAnswer = selectedAnswerIndex !== null ? answers[selectedAnswerIndex] : null;

        return (
            <Fragment>
                <Paper className={classes.paper}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                        Answer
                    </Typography>
                    <Divider />
                    <List>{this.renderAnswerList()}</List>

                    <div className={classes.buttonContainer}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.addButton}
                            onClick={this.handleOpenAnswerDialog}
                            fullWidth
                        >
                            Add Answer
                        </Button>
                    </div>
                </Paper>
                <NewAnswerDialog
                    open={answerDialogOpen}
                    handleCancel={this.handleAnswerCancel}
                    handleAdd={this.handleAnswerAdd}
                    answer={selectedAnswer}
                    globalSecondaryFields={globalSecondaryFields}
                />
                <BulkAnswerDialog
                    open={bulkDialogOpen}
                    onClose={this.handleBulkClose}
                    answers={answers}
                />
            </Fragment>
        );
    }
}

export default withStyles(styles)(AnswerSetBuilder);
