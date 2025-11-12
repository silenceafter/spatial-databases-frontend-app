import React, { useState } from "react";
import { Outlet, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Box, Grid, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const pages = ['Главная', 'Куда сходить', 'Что посмотреть', 'Где поесть', 'Как добраться', 'Советы'];

export default function Layout() {

  //
  return (
    <>
      {/* 1. Фиксированная шапка — НЕ в потоке документа */}
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          left: 0,
          right: 0,           // ← вместо width: 100vw!
          zIndex: (theme) => theme.zIndex.appBar,
          bgcolor: '#005a4c', // ваш зелёный цвет
        }}
      >
        <Toolbar sx={{ justifyContent: 'center'}}>          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {pages.map((page) => (
              <Typography
                key={page}
                variant="body1"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
                onClick={() => console.log(`Go to ${page}`)}
              >
                {page}
              </Typography>
            ))}
        </Box>
        </Toolbar>
      </AppBar>

      {/* 2. Основной контент — под шапкой */}
      <Box
        component="main"
        sx={{
          // Отступ сверху = высоте AppBar (по умолчанию ~56px + 16px padding = ~64px)
          // Лучше использовать theme.mixins.toolbar — это официальный способ MUI
          ...theme => ({
            marginTop: theme.mixins.toolbar.minHeight,
            padding: theme.spacing(3),
          }),
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Outlet /> {/* Сюда подставляются HomePage, ProfilePage и др. */}
      </Box>
    </>
  );
}