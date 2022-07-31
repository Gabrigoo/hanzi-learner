import React, { ReactElement } from 'react';

import { Link } from 'react-router-dom';

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { MainInt, MainCharacterInt, MainWordInt } from '../../interfaces';

type ReactProps = {
  results: string[],
  mainData: MainInt,
};

const SearchResultTable: React.FC<ReactProps> = (props): ReactElement => {
  const rows = props.results.map((item) => {
    let data: {[key: string]: MainCharacterInt } | {[key: string]: MainWordInt};
    let trad: string;

    if (item.length === 1) {
      data = props.mainData.characters;
      trad = data[item].chineseTrad;
    } else {
      data = props.mainData.words;
      trad = data[item].chineseTrad.join('');
    }

    return {
      traditional: trad,
      simplified: data[item].chineseSimp,
      reading: data[item].pinyin,
      tone: data[item].tone,
      meaning: data[item].english[0],
    };
  });

  return (
    <TableContainer component={Paper} sx={{ mb: '20px' }}>
      <Table aria-label="search result table">

        <TableHead>
          <TableRow>
            <TableCell align="center">Traditional</TableCell>
            <TableCell align="center">Simplified</TableCell>
            <TableCell align="center">Reading</TableCell>
            <TableCell align="center">Tone</TableCell>
            <TableCell align="center">Meaning</TableCell>
            <TableCell sx={{ width: '40px' }} />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? rows.map((row) => (
            <TableRow
              key={row.traditional}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center" component="th" scope="row" sx={{ fontSize: '26px' }}>
                {row.traditional}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: '26px' }}>{row.simplified}</TableCell>
              <TableCell align="center" sx={{ fontSize: '18px' }}>{row.reading}</TableCell>
              <TableCell align="center" sx={{ fontSize: '18px' }}>{row.tone}</TableCell>
              <TableCell align="center" sx={{ fontSize: '18px' }}>{row.meaning}</TableCell>
              <TableCell align="center">
                <Link className="no-underline" to={`/info/${row.traditional}`}>
                  <IconButton aria-label="details">
                    <ArrowForwardIcon />
                  </IconButton>
                </Link>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell component="th" scope="row">
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SearchResultTable;
