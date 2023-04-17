import React from "react";
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import history from "./history";
import App from './components/App';
import Blocks from './components/Block/Blocks';
import TransactionPool from "./components/Transact/TransactionPool";
import PublicAuctions from "./components/Auction/AuctionScreen";
import AddressBook from "./components/Usability/AddressBook";
import AuctionHistory from "./components/Usability/AuctionHistoryRequest";
import walletHistory from "./components/Usability/walletHistoryRequest"
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

render(
        <Router history={history}>
            <Switch>
                <Route exact path='/' component={App} />
                <Route path='/blocks' component={Blocks} />
                <Route path='/transaction-pool' component={TransactionPool} />
                <Route path='/auctions' component={PublicAuctions} />
                <Route path='/address-book' component={AddressBook} />
                <Route path='/wallet-history' component={walletHistory} />
                <Route path='/item-history' component={AuctionHistory} />
            </Switch>
        </Router>, 
        document.getElementById('root')
    );