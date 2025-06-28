import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useIntl } from "react-intl";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

const AiImagingLab = () => {
  const intl = useIntl();
  const [doctorNote, setDoctorNote] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("STT not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // 또는 "ko-KR"
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setDoctorNote((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const readImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setUploadedImageUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        readImageFile(file);
      } else {
        alert("Please upload a valid image file.");
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        readImageFile(file);
      } else {
        alert("Please upload a valid image file.");
      }
    }
  };

  const handleClickUploadBox = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", height: "100%" }}>
      {/* 왼쪽: CT 이미지 업로드 */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          pr: { md: 2 },
          mb: { xs: 2, md: 0 },
        }}
      >
        <Paper sx={{ height: "100%", p: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, color: "var(--color-navy)" }}
          >
            {intl.formatMessage({
              id: "upload_ct_image",
              defaultMessage: "Upload CT Image",
            })}
          </Typography>
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClickUploadBox}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            sx={{
              border: `2px dashed ${isDragging ? "#1976d2" : "gray"}`,
              height: "90%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              textAlign: "center",
              px: 2,
            }}
          >
            {uploadedImageUrl ? (
              <Box
                component="img"
                src={uploadedImageUrl}
                alt="Uploaded CT"
                onError={() => setUploadedImageUrl(null)}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography color="textSecondary">
                Drag & Drop or Click to Upload
              </Typography>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />
          </Box>
        </Paper>
      </Box>

      {/* 오른쪽: 결과 및 노트 */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* 진단 결과 */}
        <Box sx={{ mb: 2, height: "50%" }}>
          <Paper sx={{ height: "100%", p: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, color: "var(--color-navy)" }}
            >
              {intl.formatMessage({
                id: "diagnosis_result",
                defaultMessage: "Diagnosis Result",
              })}
            </Typography>
            <Typography variant="h6">
              Lung Cancer Probability: <strong>85%</strong>
            </Typography>
          </Paper>
        </Box>

        {/* 의사 노트 + STT */}
        <Box sx={{ height: "50%", width: "100%" }}>
          <Paper sx={{ height: "100%", p: 2, position: "relative" }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, color: "var(--color-navy)" }}
            >
              {intl.formatMessage({
                id: "doctor_note",
                defaultMessage: "Doctor's Note",
              })}
            </Typography>
            <TextField
              multiline
              rows={9}
              fullWidth
              placeholder="Enter your analysis or recommendation here..."
              value={doctorNote}
              onChange={(e) => setDoctorNote(e.target.value)}
              variant="outlined"
            />
            {/* 마이크 버튼 */}
            <Tooltip
              title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
              <IconButton
                onClick={isListening ? stopListening : startListening}
                sx={{ position: "absolute", bottom: 16, right: 16 }}
              >
                {isListening ? (
                  <StopIcon color="error" />
                ) : (
                  <MicIcon color="primary" />
                )}
              </IconButton>
            </Tooltip>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AiImagingLab;
