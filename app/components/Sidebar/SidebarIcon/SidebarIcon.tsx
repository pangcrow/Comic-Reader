import React, { ComponentType } from 'react';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';

export interface SidebarIconProps extends WithStyles<typeof sidebarIconStyles> {
  Icon: ComponentType<any>;
  [props: string]: any;
}

export const sidebarIconStyles = () =>
  createStyles({
    size: {
      width: 50,
      height: 50
    },
    color: {
      color: grey.A200,
      '&:hover': {
        color: grey[50],
        '& $icon': {
          color: grey[50]
        }
      }
    },
    iconButton: {
      padding: 0
    },
    icon: {
      cursor: 'pointer',
      fontSize: 30
    }
  });

export const SidebarIcon = withStyles(sidebarIconStyles)(
  ({ Icon, classes, ...props }: SidebarIconProps) => {
    const { size, color, iconButton, icon } = classes;

    if (/Icon/.test(Icon.displayName)) {
      return (
        <IconButton className={`${size} ${color} ${iconButton}`} {...props}>
          <Icon className={icon} color="inherit" />
        </IconButton>
      );
    }

    return <Icon className={`${size} ${color}`} {...props} />;
  }
);
