import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from "react-i18next";
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';
import { QUESTIONNAIRES_URL } from '../../constants/base.const';

import { PersonIndex } from "../../model/estimates.model";

interface Props {
  domain: string;
  uri: string;
  open: boolean;
  onClose: () => void;
}
export default function QRCodeModal(props: Props) {
  const { t } = useTranslation();

  const jsonString = atob(atob(atob(props.uri)));
  const person: PersonIndex = jsonString ? JSON.parse(jsonString).person : 1;
  
  let modalTitle: string;
  if (props.domain === QUESTIONNAIRES_URL) {
    modalTitle = person === 1 ? t("Word.Child")
      : t("Word.Guardian") + (person === 2 ? " 1" : " 2");
  } else {
    modalTitle = t("Word.Self");
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="qrcode-modal"
      aria-describedby="qrcode"
      fullWidth={true}
      maxWidth="xs"
    >
      <DialogTitle sx={{
        display: "flex",
        justifyContent: "space-between",
      }}>
        <Typography color="success.main" variant="h4" component="span">{modalTitle}</Typography>
        <IconButton
          aria-label='close'
          onClick={props.onClose}
        >
          <CancelIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{
          textAlign: "center"
        }}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            level="M"
            value={props.domain + "/" + props.uri}
            viewBox={`0 0 256 256`}
          />
          <Link to={props.domain + "/" + props.uri} target="_blank">
            {t("Action.ClickMeToGoToQuestionnaires")}
          </Link>
        </Box>
      </DialogContent>
    </Dialog >
  );
}