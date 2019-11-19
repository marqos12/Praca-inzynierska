import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenTestCanal, wsSendTestMessage, wsSendMessage, setHistory, logout } from "../../actions/index";

function mapDispatchToProps(dispatch) {
    return {
       
    };
}

const mapStateToProps = state => {
    return {
        
    };
};



class AboutComponent extends Component {
    constructor() {
        super();
        this.state = {
        }

    }

    

    render() {
        return (
            <div className="container">
                <div className="menuContent about">
                    <h1 className="gameTitle">O grze Moje Miasto</h1>

                    <div className="buttonList">
                        
                        <p>Gra powstała w ramach pracy inżynierskiej studenta <b>Marka Czopora</b> na <b>Politechnice Rzeszowskiej</b>, pod opieką promotora <b>dr inż. Grzegorza Hałdaśa</b></p>
                        <br />
                        <img src="assets/inzynier.png"/>
                        <br/>
                        <p>Moje Miasto to przeglądarkowa gra planszowa z elementami strategii ekonomicznej. Zadaniem gracza jest rozwój miasta, za pomocą gotowych elementów (płytek z budynkami).</p>
                        <p>Płytki powinny być układane zgodnie z dopasowaniem terenu. O dokładnych zasadach i przebiegu gry możesz poczytać <a className="subtitleBtn noBorder" href="assets/manual.pdf"  target="_blank"   >tutaj</a></p>
                        <br/>
                        <img src="assets/rozgrywka.jpg"/>
                        <br />
                        <p>Aplikacja jest przystosowana zarówno dla ekranów komputerów osobistych jak i urządzeń mobilnych. Zabierz więc grę ze sobą w każde miejsce i ciesz się zabawą ze znajomymi!</p>
                        <br />
                        <img src="assets/rozgrywka-mobilne.jpg"/>
                        <br />
                        <NavLink to="/#" className="button is-large  is-link is-rounded is-fullwidth" >Powrót</NavLink>
                    </div>

                </div>
            </div>
        );
    }
}   
const About = connect(mapStateToProps, mapDispatchToProps)(AboutComponent);
export default About;