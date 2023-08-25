import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from 'axios';
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from 'react-query';
import { Link, useNavigate } from "react-router-dom";

import { ButtonPrimary, ButtonRed } from "../../core/components/button/Button";
import QRCodeModal from '../../core/components/modal/QRCodeModal';
import StatusChip from "../../core/components/status/StatusChip";
import { API_URL, QUESTIONNAIRES_URL1 } from '../../core/constants/base.const';
import { useAppSelector } from "../../core/hooks/rtkHooks";
import { useFollowUpData } from "../../core/hooks/useFollowUpData";
import DashboardLayout from "../../core/layout/DashboardLayout";
import { OccasionIndex, PersonIndex } from '../../core/model/adultEstimates.model';
import { OrsAndScore15WithOccasion } from '../../core/model/score.model';
import { SurveyStatus } from "../../core/model/status.model";
import { backgroundAdultSurveyPath, followUpSurveyPath } from "../../core/util/pathBuilder.util";

interface ScanLinkProps {
  disabled: boolean;
  onClick: () => void;
}

const ScanLink = ({
  disabled,
  onClick
}: ScanLinkProps) => {
  return (
    <Box
      sx={{
        textDecoration: disabled ? "none" : "underline",
        textTransform: "capitalize",
        color: disabled ? "text.primary" : "success.main",
        fontWeight: "bold",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer"
      }}
      onClick={() => (!disabled && onClick())}
    >
      Scan
    </Box>
  );
};

export default function EstimatesAdultPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { username } = useAppSelector(state => state.user);
  const currentEstimatesAdult = useAppSelector(state => state.backgroundAdultSurvey.currentEstimatesAdult);
  const {
    data: followUpData,
    isFetched: isFetchedFollowUpData
  } = useFollowUpData(currentEstimatesAdult.codeNumber);
  const completedFollowUpSurvey = isFetchedFollowUpData && !!followUpData?.codeNumber;

  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [targetURI, setTargetURI] = useState("");
  const [qrcodeUriDomain, setQrcodeUriDomain] = useState("");

  const { data: scores } = useQuery<OrsAndScore15WithOccasion[]>("getScoresByCodeNumberAndOccasion", () =>
    axios.post(
      `${API_URL}/adult-score/getScoresByCodeNumberAndOccasion`,
      {
        codeNumber: currentEstimatesAdult.codeNumber
      }
    ).then(res => res.data)
  );

  const handleClickScanLink = (person: PersonIndex, occasion: OccasionIndex) => {
    setTargetURI(btoa(btoa(btoa(JSON.stringify({
      codeNumber: currentEstimatesAdult.codeNumber,
      person,
      occasion,
      score15: 0,
      ors: 0
    })))));
    setShowQRCodeModal(true);
    setQrcodeUriDomain(QUESTIONNAIRES_URL1);
  };

  const handleClickImportantEventsScanLink = () => {
    setTargetURI(btoa(btoa(btoa(JSON.stringify({
      codeNumber: currentEstimatesAdult.codeNumber,
    })))));
    setShowQRCodeModal(true);
    setQrcodeUriDomain("https://vallentuna-important-events.netlify.app");
  };

  const handleClickFillOutFollowUpSurvey = () => {
    navigate(followUpSurveyPath(currentEstimatesAdult.codeNumber));
  };

  const handleClickSendSurvey = async (occasion: OccasionIndex | 0) => {
    const { data } = await axios({
      method: "POST",
      url: `${API_URL}/background-adult-data/download-docx`,
      data: {
        codeNumber: currentEstimatesAdult.codeNumber,
        occasion: occasion
      },
      responseType: "blob"
    });

    saveAs(data, "survey.docx");
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Card sx={{ width: "70%", margin: "auto", marginTop: 3, borderRadius: "20px", padding: "8px" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <StatusChip
                    circlePosition="right"
                    status={currentEstimatesAdult.status}
                    variant="medium"
                    content={<Typography fontWeight="600">{currentEstimatesAdult.codeNumber}</Typography>}
                  />

                  <Stack alignItems="center">
                    <Link to={backgroundAdultSurveyPath(currentEstimatesAdult.codeNumber)} style={{ textDecoration: "none" }}>
                      <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                        <OpenInNewIcon sx={{ color: "success.main" }} />
                        <Typography color="success.main">{t("Estimates.BackgroundSimpleInformation")}</Typography>
                      </Stack>
                    </Link>

                    <Typography>{t("Estimates.ResponsiveProcessor")}: <strong>{username}</strong></Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Estimates & Status Icons */}
          <Grid item md={6}>
            <Typography variant="h4" fontWeight="600" color="text.primary" align="center">{t("Word.Estimates")}</Typography>
          </Grid>
          <Grid item md={6}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography fontWeight="600" color="success.main">Status:</Typography>
              <StatusChip
                circlePosition="left"
                status={SurveyStatus.Clear}
                variant="medium"
                content={<Typography>{t("Status.Clear")}</Typography>}
              />
              <StatusChip
                circlePosition="left"
                status={SurveyStatus.Loss}
                variant="medium"
                content={<Typography>{t("Status.Loss")}</Typography>}
              />
              <StatusChip
                circlePosition="left"
                status={SurveyStatus.Coming}
                variant="medium"
                content={<Typography>{t("Status.Coming")}</Typography>}
              />
            </Stack>
          </Grid>

          {[...Array(3)].map((_occasionIt, occasionIndex) => {
            let ors = 0, score15 = 0;
            if (scores) {
              const filteredScores = scores.filter(s => s.occasion === (occasionIndex + 1));
              ors = Math.round(filteredScores.map(obj => obj.ors).reduce((prev, total) => total + prev, 0) / filteredScores.length);
              score15 = +(filteredScores.map(obj => obj.score15).reduce((prev, total) => total + prev, 0) / filteredScores.length).toFixed(2);
            }
            const [
              date,
              label,
              statusOfChild,
            ] = occasionIndex === 0 ? [
              currentEstimatesAdult.history.zeroMonth.date,
              `${t("Word.Month")} 0 -`,
              currentEstimatesAdult.history.zeroMonth.statusInDetail.child,
            ]
                : occasionIndex === 1 ? [
                  currentEstimatesAdult.history.sixMonths.date,
                  `${t("Word.Month")} 6 -`,
                  currentEstimatesAdult.history.sixMonths.statusInDetail.child
                ]
                  : [
                    currentEstimatesAdult.history.twelveMonths.date,
                    `${t("Word.Month")} 12 -`,
                    currentEstimatesAdult.history.twelveMonths.statusInDetail.child
                  ];

            const isScanLocked = Math.abs(dayjs().diff(date, "week")) > 0;

            return (
              <Grid item md={6} key={`grid-item-${occasionIndex}`}>
                <Card sx={{ borderRadius: "20px", padding: "8px" }}>
                  <CardHeader
                    title={
                      <Typography fontWeight="medium" align="center" sx={{ textDecoration: "underline" }}>
                        {`${t("Word.Survey")}: `}<strong>{dayjs(date).format("YYYY-MM-DD")}</strong>
                      </Typography>
                    }
                  >
                  </CardHeader>
                  <CardContent>
                    <Grid container>
                      <Grid item md={6}>
                        <Stack gap={2}>
                          <Stack direction="row" alignItems="center" gap={2}>
                            <Typography fontWeight="bold" variant="h4">{label}</Typography>
                            <Paper elevation={6} sx={{ borderRadius: "100%", width: "120px", height: "120px", padding: "16px" }}>
                              <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                                <Typography color="text.secondary" fontWeight="bold" fontSize={16}>Score V</Typography>
                                <Typography color="info.main" fontWeight="600" variant='h4'>
                                {!ors? (
                                  "N/A"
                                ) : (
                                  ors
                                )}
                                </Typography>
                                
                              </Stack>
                            </Paper>
                          </Stack>

                          <Stack direction="row" alignItems="center" gap={2}>
                            <Typography fontWeight="bold" variant="h4">{label}</Typography>
                            <Paper elevation={6} sx={{ borderRadius: "100%", width: "120px", height: "120px", padding: "16px" }}>
                              <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                                <Typography color="text.secondary" fontWeight="bold" fontSize={16}>Score</Typography>
                                <Typography color="info.main" fontWeight="600" variant='h4'>
                                  {!score15? (
                                    "N/A"
                                  ) : (
                                    score15
                                  )}
                                </Typography>
                              </Stack>
                            </Paper>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item md={6}>
                        <Stack justifyContent="center" height="100%" gap={2}>
                          <Stack direction="row" alignItems="center" gap={2}>
                            {/* <Typography fontWeight="bold">{t("Word.Self")}</Typography> */}
                            <StatusChip
                              circlePosition="left"
                              status={statusOfChild}
                              variant="large"
                              content={<ScanLink disabled={isScanLocked} onClick={() => handleClickScanLink(1 as PersonIndex, (occasionIndex + 1) as OccasionIndex)} />}
                            />
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <ButtonPrimary onClick={() => handleClickSendSurvey(occasionIndex + 1 as OccasionIndex)}>{t("Estimates.SendSurvey")}</ButtonPrimary>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}

          {/* Mon 12 - Important events during 12 months */}
          <Grid item md={6}>
            <Card sx={{ borderRadius: "20px", padding: "8px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <CardHeader
                title={
                  <Typography fontWeight="medium" align="center">
                    {`${t("Estimates.SurveyWindow")} `}<strong>{`Month 12 - ${t("Estimates.ImportantEventsDuring12Months")}`}</strong>
                  </Typography>
                }
                sx={{
                  textDecoration: "underline"
                }}
              >
              </CardHeader>
              <CardContent>
                <Grid container>
                  <Grid item md={6}>
                    <Stack direction="row" alignItems="center" gap={2}>
                      <Typography fontWeight="bold" variant="h4">{`${t("Estimates.ImpEvents")} - `}</Typography>
                      <Paper elevation={6} sx={{ borderRadius: "100%", width: "120px", height: "120px", padding: "16px" }}>
                        <Stack justifyContent="center" alignItems="center" sx={{
                          height: "100%",
                          color: "text.secondary",
                          fontSize: 16
                        }}>
                          <Typography fontWeight="bold">{t("Estimates.ReminderIfTwoMonths")}</Typography>
                        </Stack>
                      </Paper>
                    </Stack>
                  </Grid>
                  <Grid item md={6}>
                    <Stack direction="row" alignItems="center" gap={2} height="100%">
                      {/* <Typography fontWeight="bold">{t("Word.Self")}</Typography> */}
                      <StatusChip
                        circlePosition="left"
                        status={SurveyStatus.Loss}
                        variant="large"
                        content={<ScanLink disabled={false} onClick={() => handleClickImportantEventsScanLink()} />}

                      />
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <ButtonPrimary onClick={() => {
                  handleClickSendSurvey(0);
                }}>{t("Estimates.SendSurvey")}</ButtonPrimary>
              </CardActions>
            </Card>
          </Grid>

          {/* Follow Up Survey */}
          <Grid item md={6} my={4}>
            <Stack>
              <Link to={followUpSurveyPath(currentEstimatesAdult.codeNumber)} style={{ textDecoration: "none" }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <OpenInNewIcon sx={{ color: "success.main" }} />
                  <Typography color="success.main">{t("Estimates.FollowUpSurvey(TheProcessor)")}</Typography>
                </Stack>
              </Link>

              <Typography color="text.primary" fontWeight="bold" variant="h4">{t("Estimates.2weeks12months")}</Typography>
            </Stack>
          </Grid>
          <Grid item md={6} my={4}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography fontWeight="600" color="success.main" variant='h4'>Status:</Typography>
              <Typography fontWeight="bold">{t(completedFollowUpSurvey ? "Estimates.FollowSurveyDone" : "Estimates.FollowUpSurveyNotDone")}</Typography>
              <ButtonRed disabled={completedFollowUpSurvey} sx={{ color: "#FFF" }}>
                {t(completedFollowUpSurvey ? "Estimates.Completed" : "Estimates.CloseCase")}
              </ButtonRed>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <QRCodeModal
        open={showQRCodeModal}
        onClose={() => setShowQRCodeModal(false)}
        domain={qrcodeUriDomain}
        uri={targetURI}
      />
    </DashboardLayout>
  );
}