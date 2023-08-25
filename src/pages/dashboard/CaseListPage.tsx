import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import { DataGridPro } from "@mui/x-data-grid-pro"
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";

import { TodoIconImage } from "../../assets/AppImages";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import DashboardLayout from "../../core/layout/DashboardLayout";
import { EstimatesDto } from "../../core/model/estimates.model";
import { SurveyStatus } from '../../core/model/status.model';
import { setCurrentEstimatesAction } from '../../core/store/slices/backgroundSurveySlice';
import { loadCaseListData } from "../../core/store/slices/caseListSlice";
import { adultCaseList, adultSystematicFollowUpPath, estimatesPath } from '../../core/util/pathBuilder.util';
import HistorySummary from './resources/HistorySummary';
import StyledTab from './resources/StyledTab';
import StyledTabs from './resources/StyledTabs';
import TabPanel from './resources/TabPanel';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

export default function CaseListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { caseList } = useAppSelector(state => state.caseListSurvey);

  const [searchString, setSearchString] = useState("");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  // const [showLinkModal, setShowLinkModal] = useState(false);
  // const [selectedRow, setSelectedRow] = useState<EstimatesDto>();

  const columns: GridColDef[] = useMemo(() => ([
    // { field: 'id', type: 'number', sortable: false, width: 30 }, 
    {
      field: 'codeNumberForSort',
      headerName: t("CaseList.TableHeader.CodeNumber").toString(),
      headerAlign: "left",
      align: "left",
      type: 'number',
      sortable: true,
      width: 300,
      renderCell: (data) => {
        return <p>{data.row.codeNumber}</p>
      }
    },
    {
      field: 'status',
      headerName: t("CaseList.TableHeader.Status").toString(),
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 300,
      renderCell: () => <TodoIconImage />
    },
    // {
    //   field: 'missedFields',
    //   headerName: t("CaseList.TableHeader.Todo").toString(),
    //   headerAlign: "left",
    //   align: "left",
    //   sortable: false,
    //   width: 300,
    //   renderCell: () => <ToDoList />
    // },
    {
      field: 'history',
      headerName: t("CaseList.TableHeader.SurveyStatus").toString(),
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 400,
      renderCell: (props: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => <HistorySummary data={props.value} />
    },
    {
      field: 'nextSurvey',
      headerName: t("CaseList.TableHeader.NextSurvey").toString(),
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 400,
    },  
  ]), [t]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  const handleRowClick = (e: GridRowParams<EstimatesDto>) => {
    // setShowLinkModal(true);
    // setSelectedRow(e.row);

    dispatch(setCurrentEstimatesAction(e.row));
    navigate(estimatesPath());
  };

  const filteredRows = caseList ? (activeTabIndex === 0 ? caseList
    : caseList.filter(row => row.status === (
      activeTabIndex === 1 ? SurveyStatus.Clear
        : activeTabIndex === 2 ? SurveyStatus.Coming
          : SurveyStatus.Loss)
    )).filter(row => row.codeNumber.includes(searchString))
    : [];

  useEffect(() => {
    dispatch(loadCaseListData());
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <TextField
              id="search-bar"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              placeholder={t("Dashboard.SearchCodeNumber").toString()}
              value={searchString}
              onChange={e => setSearchString(e.target.value)}
            />
          </CardContent>
        </Card>
        <Typography>{t("Case.Adult")}</Typography>
        <NavLink to={adultCaseList()} className={({ isActive }) => isActive ? "active" : ""}>
          <ToggleOnIcon />
        </NavLink>
        <Card>
          <CardContent sx={{ padding: 0 }}>
            <Box>
              <StyledTabs value={activeTabIndex} onChange={handleTabChange} aria-label="basic tabs example">
                <StyledTab
                  icon={(caseList?.length || 0).toString()}
                  label={t("CaseList.AllCodeNumber")}
                />
                <StyledTab
                  icon={(caseList?.filter(data => data.status === SurveyStatus.Clear).length || 0).toString()}
                  label={t("CaseList.FullyAnswered")}
                />
                <StyledTab
                  icon={(caseList?.filter(data => data.status === SurveyStatus.Coming).length || 0).toString()}
                  label={t("CaseList.Ongoing")}
                />
                <StyledTab
                  icon={(caseList?.filter(data => data.status === SurveyStatus.Loss).length || 0).toString()}
                  label={t("CaseList.ActionRequired")}
                />
              </StyledTabs>
            </Box>
            <TabPanel>
              <Box className="w-full">
                <DataGridPro
                  rows={filteredRows}
                  columns={columns}
                  autoHeight={true}
                  rowSelection={false}
                  rowHeight={80}
                  checkboxSelection={false}
                  onRowClick={handleRowClick}
                  classes={{
                    columnHeaderTitle: "font-bold"
                  }}
                />
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

      </Box>
    </DashboardLayout>
  );
}