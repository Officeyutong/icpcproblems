import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Dimmer, Divider, Grid, Header, Icon, Loader, Segment } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import { Markdown } from "./Markdown";
function myRandom(min: number, max: number) {
    return parseInt(String(min + Math.random() * (max - min) + 0.5));
}
interface ProblemItem {
    statement: string;
    answer: string;
};

type ProblemList = ProblemItem[];

const LIMIT_SECONDS = 213;

const App: React.FC<{}> = () => {
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ProblemList | null>(null);
    const [problem, setProblem] = useState<ProblemItem | null>(null);
    const [running, setRunning] = useState(false);  
    const [countdown, setCountdown] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    useEffect(() => {
        if (!loaded) {
            setLoading(true);
            setData(
                require("../assets/data.json") as ProblemList
            );
            setLoading(false);
            setLoaded(true);
        }
    }, [loaded]);
    const endGame = () => {
        setRunning(false);
        setShowResult(true);
    };
    const chooseNextProblem = () => {
        if (!data) return;
        const prob = data[myRandom(0, data.length - 1)];
        setProblem(prob);
        setShowAnswer(false);
    };
    const start = () => {
        setShowResult(false);
        setCountdown(LIMIT_SECONDS);
        setCorrectCount(0);
        setRunning(true);
        chooseNextProblem();
    };
    const passCurrent = () => {
        setCorrectCount(c => c + 1);
        chooseNextProblem();

    };
    const skipCurrent = () => {
        chooseNextProblem();
    }
    const checkAnswer = () => {
        setShowAnswer(true);
    };
    useEffect(() => {
        if (running) {
            let token = setInterval(() => {
                if (countdown <= 0) {
                    clearInterval(token);
                    endGame();
                } else {
                    setCountdown(c => c - 1);
                }
            }, 1000);
            return () => clearInterval(token);
        }
    }, [countdown, running]);
    return <div style={{ marginTop: "5%" }}>
        <Grid centered columns="3">
            <Grid.Column width="12">
                {loading && <div style={{ height: "400px" }}>
                    <Dimmer active={loading}>
                        <Loader>加载中..</Loader>
                    </Dimmer>
                </div>}
                <Header as="h1">
                    招新现场答题
                </Header>
                <Segment stacked textAlign="center">
                    {running ? <>
                        <div className="large-text">
                            <Grid columns="2">
                                <Grid.Column>
                                    倒计时剩余: <span style={{ color: "green" }}>{countdown}s</span>
                                </Grid.Column>
                                <Grid.Column>
                                    已答对题目数: <span style={{ color: "green" }}>{correctCount}</span>
                                </Grid.Column>
                            </Grid>
                        </div>
                        <Divider></Divider>
                        <div className="huge-text">
                            <Markdown markdown={problem!.statement}></Markdown>
                            {showAnswer && <div>
                                <div style={{ color: "green" }}>
                                    <Markdown markdown={problem!.answer}></Markdown>
                                </div>
                            </div>}
                        </div>
                        <Divider></Divider>
                        <Grid columns="1">
                            <Grid.Column>
                                <ButtonGroup>
                                    <Button color="blue" onClick={checkAnswer}>
                                        查看答案
                                    </Button>
                                    <Button color="red" icon labelPosition="left" onClick={skipCurrent}>
                                        <Icon name="times"></Icon>
                                        未通过此题
                                    </Button>

                                    <Button color="purple" icon labelPosition="right" onClick={endGame}>
                                        <Icon name="clock"></Icon>
                                        结束答题
                                    </Button>

                                </ButtonGroup>
                            </Grid.Column>
                            {showAnswer && <Grid.Column>
                                <Button color="green" icon labelPosition="left" onClick={passCurrent}>
                                    <Icon name="checkmark"></Icon>
                                通过此题
                            </Button>
                            </Grid.Column>}
                        </Grid>
                    </> : <>
                        {showResult ? <>
                            <span className="large-text">恭喜！通过题目数:<span style={{ color: "green" }}>
                                {correctCount}</span></span>
                        </> : <span className="large-text" style={{ height: "400px" }}>
                            答题尚未开始
                        </span>}
                        <Divider></Divider>
                        <Button color="green" onClick={start}>
                            开始答题
                        </Button>
                    </>}
                    {/* <span>按回车可以选择通过某个题</span> */}
                </Segment>
            </Grid.Column>
        </Grid>
    </div>;
};

export default App;