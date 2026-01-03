import React, { useState } from "react";
import {
  Box,
  Button,
  Avatar,
  Text,
  VStack,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { uploadProfile } from "../../api/protected.api";
import { replace, useNavigate } from "react-router-dom";

const Profile = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle image selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // handle skip:
  const handleSkip = (e =>{
    navigate('/user/dashboard/chat', { replace: true });
  })

  // Upload image
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an image first");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("profilePhoto", file);

      const token = localStorage.getItem("token");

      const res = await uploadProfile(formData)

      setMessage("Profile photo uploaded successfully ✅");
      navigate('/user/dashboard/chat', { replace: true });
    } catch (error) {
        console.error(error);
      setMessage(
        error.response?.data?.message || "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        p={8}
        borderWidth="1px"
        borderRadius="lg"
        w="100%"
        maxW="400px"
        textAlign="center"
      >
        <VStack spacing={5}>
          <Text fontSize="2xl" fontWeight="bold">
            Upload Profile Photo
          </Text>

          {/* Avatar Preview */}
          <Avatar
            size="2xl"
            src={preview || undefined}
          />

          {/* File Input */}
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            p={1}
          />

          {/* Upload Button */}
          <Button
            colorScheme="blue"
            w="full"
            onClick={handleUpload}
            isLoading={loading}
            loadingText="Uploading"
          >
            Upload
          </Button>
          <Button onClick={handleSkip}>Skip</Button>

          {/* Message */}
          {message && (
            <Text fontSize="sm" color="gray.600">
              {message}
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Profile;

