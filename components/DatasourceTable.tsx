/* eslint-disable jsx-a11y/anchor-is-valid */
import { AutorenewRounded, PlayArrow } from '@mui/icons-material';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Sheet from '@mui/joy/Sheet';
import { ColorPaletteProp } from '@mui/joy/styles';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import {
  AppDatasource as Datasource,
  DatasourceStatus,
  DatasourceType,
} from '@prisma/client';
import Link from 'next/link';
import * as React from 'react';

import useStateReducer from '@app/hooks/useStateReducer';
import { RouteNames } from '@app/types';
import relativeDate from '@app/utils/relative-date';

const SynchButton = ({
  datasource,
  onClick,
}: {
  datasource: Datasource;
  onClick: any;
}) => {
  const [state, setState] = useStateReducer({
    loading: false,
    buttonText: 'Synch',
    color: 'info',
  });

  React.useEffect(() => {
    let loading = false;
    let buttonText = 'Synch';
    let color = 'neutral';

    if (
      datasource.status === DatasourceStatus.running ||
      datasource.status === DatasourceStatus.pending
    ) {
      loading = true;
    }

    switch (datasource.status) {
      case DatasourceStatus.running:
        buttonText = 'Running';
        break;
      case DatasourceStatus.pending:
        buttonText = 'Pending';
        break;
      case DatasourceStatus.error:
        buttonText = 'Synch';
        color = 'error';
        break;
      case DatasourceStatus.unsynched:
      case DatasourceStatus.synched:
        buttonText = 'Synch';
        break;
      default:
        break;
    }

    setState({
      loading,
      buttonText,
      color,
    });
  }, [datasource?.status]);

  if (![DatasourceType.web_page].includes(datasource.type as any)) {
    return null;
  }

  return (
    <Button
      {...(state.loading
        ? {
            loading: true,
            startDecorator: <PlayArrow />,
            loadingPosition: 'start',
          }
        : {
            startDecorator: <PlayArrow />,
          })}
      onClick={onClick}
      size="sm"
      variant="outlined"
      color={state.color as any}
      className="mr-auto rounded-full"
      startDecorator={<AutorenewRounded />}
    >
      <span>{state.buttonText}</span>
    </Button>
  );
};

export default function DatasourceTable({
  items,
  handleSynch,
}: {
  items: Datasource[];
  handleSynch: (datasourceId: string) => any;
}) {
  return (
    <React.Fragment>
      <Sheet
        className="DatasourceTableContainer"
        variant="outlined"
        sx={{
          width: '100%',
          borderRadius: 'md',
          flex: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': (theme) =>
              theme.vars.palette.background.level1,
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': (theme) =>
              theme.vars.palette.background.level1,
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 220, padding: 12 }}>Name</th>
              <th style={{ width: 120, padding: 12 }}>Type</th>
              <th style={{ width: 120, padding: 12 }}>Size</th>
              <th style={{ width: 120, padding: 12 }}>Last Synch</th>
              <th style={{ width: 120, padding: 12 }}>Status</th>
              {/* <th style={{ width: 120, padding: 12 }}>Subscription</th> */}
              <th style={{ width: 120, padding: 12 }}> </th>
            </tr>
          </thead>
          <tbody>
            {items.map((datasource) => (
              <tr key={datasource.id}>
                {/* <td style={{ textAlign: 'center' }}>
                  <Checkbox
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id)
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td> */}
                {/* <td>
                  <Typography fontWeight="md">{row.id}</Typography>
                </td> */}
                <td>
                  <div className="flex flex-col">
                    <Link
                      href={`${RouteNames.DATASTORES}/${datasource.datastoreId}/${datasource.id}`}
                    >
                      <Typography className="truncate" fontWeight={'bold'}>
                        {datasource.name}
                      </Typography>
                    </Link>
                    {/* <Typography color="neutral" className="truncate">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Iste sapiente aliquid ab iure laboriosam fuga! Magnam
                      quasi officiis sequi ea quis obcaecati quod consequatur,
                      fugiat tempore maiores perferendis doloribus natus!
                    </Typography> */}
                  </div>
                </td>

                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    // startDecorator={
                    //   {
                    //     Paid: <i data-feather="check" />,
                    //     Refunded: <i data-feather="corner-up-left" />,
                    //     Cancelled: <i data-feather="x" />,
                    //   }[row.status]
                    // }
                    // color={
                    //   {
                    //     public: 'success',
                    //     private: 'neutral',
                    //   }[datastore.visibility] as ColorPaletteProp
                    // }
                    color={'neutral'}
                  >
                    {datasource.type}
                  </Chip>
                </td>
                <td>
                  <Typography>{`${Math.floor(
                    (datasource.textSize || 0) / 1024
                  )}kb / ${datasource.nbChunks} chunks`}</Typography>
                </td>
                {/* <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar size="sm">{row.customer.initial}</Avatar>
                    <div>
                      <Typography
                        fontWeight="lg"
                        level="body3"
                        textColor="text.primary"
                      >
                        {row.customer.name}
                      </Typography>
                      <Typography level="body3">
                        {row.customer.email}
                      </Typography>
                    </div>
                  </Box>
                </td> */}
                {/* <td>{row.subscription}</td> */}
                <td>
                  <Typography className="truncate">
                    {datasource?.lastSynch &&
                      relativeDate(new Date(datasource.lastSynch))}
                  </Typography>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    // startDecorator={
                    //   {
                    //     Paid: <i data-feather="check" />,
                    //     Refunded: <i data-feather="corner-up-left" />,
                    //     Cancelled: <i data-feather="x" />,
                    //   }[row.status]
                    // }
                    sx={{
                      textTransform: 'capitalize2',
                    }}
                    color={
                      {
                        unsynched: 'neutral',
                        pending: 'primary',
                        running: 'info',
                        synched: 'success',
                        error: 'danger',
                      }[datasource.status] as ColorPaletteProp
                    }
                  >
                    {datasource.status}
                  </Chip>
                </td>
                <td className="space-x-2">
                  {/* <Button size="sm" variant="outlined">
                    Synch
                  </Button> */}
                  <SynchButton
                    datasource={datasource}
                    onClick={() => handleSynch(datasource.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      {/* <Box
        className="Pagination-mobile"
        sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <i data-feather="arrow-left" />
        </IconButton>
        <Typography level="body2" mx="auto">
          Page 1 of 10
        </Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <i data-feather="arrow-right" />
        </IconButton>
      </Box>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 4,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Button
          size="sm"
          variant="plain"
          color="neutral"
          startDecorator={<i data-feather="arrow-left" />}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? 'outlined' : 'plain'}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="plain"
          color="neutral"
          endDecorator={<i data-feather="arrow-right" />}
        >
          Next
        </Button>
      </Box> */}
    </React.Fragment>
  );
}