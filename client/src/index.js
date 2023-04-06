import React from "react";
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import history from "./history";
import App from './components/App';
import Blocks from './components/Block/Blocks';
import ConductTransaction from "./components/Transact/ConductTransaction";
import auctionTransaction from "./components/Transact/ConductAuctionTransaction";
import TransactionPool from "./components/Transact/TransactionPool";
import bidTransaction from "./components/Transact/CreateBid";
import Auctions from "./components/Auction/Auctions";
import NewWalletPhrase from "./components/Wallet/NewWalletPhrase";
import AddressBook from "./components/Usability/AddressBook";
import UserAuctions from "./components/User/UserAuctions"
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

render(
        <Router history={history}>
            <Switch>
                <Route exact path='/' component={App} />
                <Route path='/blocks' component={Blocks} />
                <Route path='/conduct-transaction' component={ConductTransaction} />
                <Route path='/auction-transaction' component={auctionTransaction} />
                <Route path='/bid-transaction' component={bidTransaction} />
                <Route path='/transaction-pool' component={TransactionPool} />
                <Route path='/auctions' component={Auctions} />
                <Route path='/get-wallet' component={NewWalletPhrase} />
                <Route path='/address-book' component={AddressBook} />
                <Route path='/user-items' component={UserAuctions} />
            </Switch>
        </Router>, 
        document.getElementById('root')
    );