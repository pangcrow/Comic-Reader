import React, { FormEvent, ChangeEvent } from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

export interface SearchHeaderProps {
  value: string;
  onSearch: () => void;
  onInputChange: (keyword: string) => void;
}

const styles = (theme: Theme) => ({
  background: {
    backgroundColor: theme.palette.primary.light
  },
  input: {
    marginLeft: 15,
    flex: 1,
    color: '#fff'
  },
  iconButton: {
    padding: 10
  }
});

function SearchHeaderComponent({
  classes,
  value,
  onSearch,
  onInputChange
}: SearchHeaderProps & WithStyles<typeof styles>) {
  function onSubmit(evt?: FormEvent<HTMLFormElement>) {
    evt && evt.preventDefault();
    onSearch();
  }

  function onChange(evt: ChangeEvent<HTMLInputElement>) {
    onInputChange(evt.target.value);
  }

  return (
    <div className="search-header">
      <form
        onSubmit={evt => onSubmit(evt)}
        className={`search ${classes.background}`}
      >
        <InputBase
          className={classes.input}
          onChange={onChange}
          value={value}
          fullWidth
        />
        <IconButton className={classes.iconButton} onClick={() => onSubmit()}>
          <SearchIcon color="primary" />
        </IconButton>
      </form>
    </div>
  );
}

export const SearchHeader = withStyles(styles)(SearchHeaderComponent);
