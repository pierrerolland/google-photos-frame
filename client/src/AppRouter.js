import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import AlbumsPage from './pages/AlbumsPage';
import ConfirmPage from './pages/ConfirmPage';
import IndexPage from './pages/IndexPage';
import PhotosPage from "./pages/PhotosPage";

const AppRouter = () => (
    <Router>
        <>
            <Route path="/" exact component={ IndexPage } />
            <Route path="/confirm" exact component={ ConfirmPage } />
            <Route path="/albums" exact component={ AlbumsPage } />
            <Route path="/photos/:albumId" exact component={ PhotosPage } />
        </>
    </Router>
);

export default AppRouter;
