import React, { Component } from "react";
import { connect } from "react-redux";
import { getCookie, setCookie } from "../../gameEngine/gameMechanics";
import { closeTutorial } from "../../actions/gameActions";

function mapDispatchToProps(dispatch) {
    return {
        closeTutorial: payload => dispatch(closeTutorial(payload)),
    };
}

const mapStateToProps = state => {
    return {
    };
};

class TutorialComponent extends Component {
    constructor() {
        super();
        this.state = {
            page: -1,
            minPage: -1,
            maxPage: -1,
            checkbox: false
        }
        this.next = this.next.bind(this)
        this.prev = this.prev.bind(this)
        this.checkboxClicked = this.checkboxClicked.bind(this)
        this.close = this.close.bind(this)
    }

    next() {
        this.setState({
            page: this.state.page + 1
        })
    }

    prev() {

        this.setState({
            page: this.state.page - 1
        })
    }

    componentDidMount() {
        switch (this.props.startPage) {
            case -1:
                this.setState({
                    page: 0,
                    minPage: 0,
                    maxPage: 17
                })
                break;
            case 0:
                this.setState({
                    page: 0,
                    minPage: 0,
                    maxPage: 3
                })
                break;
            case 4:
                this.setState({
                    page: 4,
                    minPage: 4,
                    maxPage: 8
                })
                break;
            case 9:
                this.setState({
                    page: 9,
                    minPage: 9,
                    maxPage: 17
                })
                break;
        }
        this.setState({ checkbox: getCookie("showTutorial") == "true" })
        if (this.props.startPage != -1)
            setCookie("tutorialLastShownPage", this.props.startPage, 1000)
    }

    close() {
        this.props.closeTutorial();
    }

    showPage(page) {
        switch (page) {
            case 0: return <div>
                <p>Celem gry, jest ułożenie fragmentu miasta. W tym celu wykorzystaj wylosowane płytki które otrzymasz.</p>
                <p> Za część ułożonych płytek dostajesz punkty. Niektóre płytki generują walutę w grze, niektóre ją konsumują.</p>
                <p> Poznaj zależności w grze aby budować jak najciekawsze miasta.</p>
                <p> Baw się dobrze :) </p>
            </div>
            case 1: return <div>
                <p>Każdą turę zaczynasz od przeciągnięcia nowej płytki</p>
                <br />
                <img src="assets/tutorial/przeciagnij.jpg" />
            </div>;
            case 2: return <div>
                <p>Płytkę ułóż na jednym z możliwych miejsc (podświetlone)</p>
                <br />
                <img src="assets/tutorial/umieść.jpg" /></div>;
            case 3: return <div>
                <p>Na koniec zatwierdź płytkę na nowym miejscu</p>
                <br />
                <img src="assets/tutorial/zatwierdź.jpg" /></div>;

            case 4: return <div>
                <h2>Obracanie płytki</h2>
            </div>;

            case 5: return <div>
                <p>Płytkę zawsze możesz obrócić klikając PPM lub dwukrotnie na nią klikając</p>
                <br />
                <img src="assets/tutorial/obracanie1.jpg" /></div>;
            case 6: return <div>
                <p>Jeżeli płytka jest na podświetlonym miejscu, moze zostać obrócona tylko w taki sposób, aby conajmniej jedna krawędź pasowała do istniejącego już otoczenia</p>
                <br />
                <img src="assets/tutorial/obracanie2.jpg" /></div>;
            case 7: return <div>
                <p>Jeżeli płytka jest na podświetlonym miejscu, moze zostać obrócona tylko w taki sposób, aby conajmniej jedna krawędź pasowała do istniejącego już otoczenia</p>
                <br />
                <img src="assets/tutorial/obracanie3.jpg" /></div>;
            case 8: return <div>
                <p>Jeżeli płytka jest na podświetlonym miejscu, moze zostać obrócona tylko w taki sposób, aby conajmniej jedna krawędź pasowała do istniejącego już otoczenia</p>
                <br />
                <img src="assets/tutorial/obracanie4.jpg" /></div>;

            case 9: return <div>
                <h2>Szczegóły płytki</h2>
            </div>;

            case 10: return <div>
                <p>Klikając dwukrotnie na płytkę, możesz wyświetlić jej szczegóły. Znajdują się tam podstawowe informacje oraz 3 przyciski:</p>
                <ol>
                    <li>Zamknij szczegóły płytki</li>
                    <li>Wyburz płytkę</li>
                    <li>Obróć płytkę</li>
                </ol>
                <br />
                <img src="assets/tutorial/szczegóły.jpg" /></div>;
            case 11: return <div>
                <p>Niektóre płytki dodatkowo możesz awansować. W dolnej części szczegółów płytki widać jakie są wymagane wpływy. Spełnij je, a będziesz mógł awansować budynek na wyższy poziom</p>
                <br />
                <img src="assets/tutorial/szczegółyPełne.jpg" /></div>;
            case 12: return <div>
                <p>Budynki oraz drogi można wybużać (po kliknięciu w ikonkę buldożera). Aby zniszczyć budynek potrzeba za to zapłacić.</p>
                <br />
                <img src="assets/tutorial/wyburzanie.jpg" /></div>;
            case 13: return <div>
                <p>Na miejscu zniszczonego budynku powstaje plac budowy. Możesz tutaj wybudować dowolny inny budynek</p>
                <br />
                <img src="assets/tutorial/placBudowy.jpg" /></div>;
            case 14: return <div>
                <p>Na miejscu zniszczonego budynku powstaje plac budowy. Możesz tutaj wybudować dowolny inny budynek</p>
                <br />
                <img src="assets/tutorial/opcjeZapisu.jpg" /></div>;
            case 15: return <div>
                <p>Aby wybudować bodynek na placu budowy, musisz za niego zapłacić</p>
                <br />
                <img src="assets/tutorial/wybuduj.jpg" /></div>;
            case 16: return <div>
                <p>Nawet po ustawieniu budynku w danym miejscu możesz go obrócić klikając w trzeci przycisk z prawej strony szczegółów płytki. Obracanie płytki w taki sposó jest darmowe</p>
                <br />
                <img src="assets/tutorial/obracanie.jpg" /></div>;
            case 17: return <div><p>Znasz już podstawy. Więcej rzeczy dowiesz się grając samemu, lub czytając kompletny poradnik</p>
                <a className="button is-large  is-link is-rounded is-fullwidth" href="assets/manual.pdf" target="_blank">Zobacz poradnik</a>
                <p>Ten poradnik możesz zawsze wyśweietlić klikając ikonkę z prawej strony pod przyciskiem menu.</p>
                <h3>Dobrej zabawy! :) </h3>
            </div>
            default: return null;
        }
    }

    checkboxClicked() {
        setCookie("showTutorial", !this.state.checkbox, 1000)
        this.setState({ checkbox: !this.state.checkbox })
    }

    render() {
        const { page, checkbox, minPage, maxPage } = this.state;

        return (
            <div className="tutorial">
                <div className="container">
                    <div className="menuContent about">
                        <h1 className="gameTitle">Poradnik </h1>
                        <div className="buttonList">
                            {this.showPage(page)}
                            <div className="buttons">
                                <div className="left">
                                    {page > minPage ? <a className="button is-large  is-link is-rounded is-fullwidth " onClick={this.prev}>Powrót</a> : ""}
                                </div>
                                <div className="right">
                                    {page < maxPage ? <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.next}>Dalej</a> : ""}
                                </div>

                                <br />
                                <br />
                                <br />
                                <br />

                                <label className="checkContainer" >Nie pokazuj tego automatycznie
                                    <input type="checkbox" checked={checkbox ? "checked" : ""} onClick={this.checkboxClicked} />
                                    <span className="checkmark"></span>
                                </label>
                                <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.close}>Zamknij</a>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const Tutorial = connect(mapStateToProps, mapDispatchToProps)(TutorialComponent);
export default Tutorial;




