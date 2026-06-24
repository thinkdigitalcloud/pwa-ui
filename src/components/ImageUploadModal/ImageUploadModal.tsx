import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  IoCameraOutline,
  IoCamera,
  IoCloudUploadOutline,
  IoClose,
  IoCameraReverseOutline,
} from 'react-icons/io5';
import { Modal } from '../Modal';
import { Spinner } from '../Spinner';

export type CameraFacing = 'user' | 'environment';

export interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * Called with the chosen image — a `File` (gallery) or `Blob` (camera capture).
   * May be async; the modal shows a spinner until it resolves.
   */
  onSelect: (image: Blob) => void | Promise<void>;

  /** Optional message shown above the Camera/Gallery options. */
  customMessage?: string;
  /** Show the Camera option. */
  enableCamera?: boolean;
  /** Show the Gallery (file picker) option. */
  enableGallery?: boolean;
  /** `accept` attribute for the file input. */
  accept?: string;
  /** Initial camera to open with. */
  initialFacing?: CameraFacing;

  /** External loading override (else the modal manages it around `onSelect`). */
  loading?: boolean;

  cameraLabel?: string;
  galleryLabel?: string;
  cancelLabel?: string;
}

/**
 * Camera + gallery image-capture modal (the apps' `ImageUploadModal`). Presents
 * Camera/Gallery options; Camera opens a live preview with a front/rear toggle
 * and a capture button. Both paths hand a `Blob`/`File` to `onSelect`. The
 * camera uses the native `getUserMedia` API — no extra dependencies.
 */
export function ImageUploadModal({
  open,
  onClose,
  onSelect,
  customMessage,
  enableCamera = true,
  enableGallery = true,
  accept = 'image/*',
  initialFacing = 'user',
  loading,
  cameraLabel = 'Camera',
  galleryLabel = 'Gallery',
  cancelLabel = 'CANCEL',
}: ImageUploadModalProps) {
  const theme = useTheme();
  const [mode, setMode] = useState<'chooser' | 'camera'>('chooser');
  const [facing, setFacing] = useState<CameraFacing>(initialFacing);
  const [busy, setBusy] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const isLoading = loading ?? busy;

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // Reset to the chooser whenever the modal is closed.
  useEffect(() => {
    if (!open) {
      setMode('chooser');
      setCameraError('');
      stopStream();
    }
  }, [open, stopStream]);

  // Acquire / release the camera stream for the current facing mode.
  useEffect(() => {
    if (!open || mode !== 'camera') return undefined;
    let cancelled = false;
    setCameraError('');
    const start = async () => {
      const md = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
      if (!md?.getUserMedia) {
        setCameraError('Camera is not available on this device.');
        return;
      }
      try {
        const stream = await md.getUserMedia({ video: { facingMode: facing }, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        if (!cancelled) setCameraError('Unable to access the camera. Please grant permission.');
      }
    };
    start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [open, mode, facing, stopStream]);

  const runSelect = useCallback(
    async (image: Blob) => {
      setBusy(true);
      try {
        await onSelect(image);
      } finally {
        setBusy(false);
      }
    },
    [onSelect],
  );

  const onPickGallery = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) await runSelect(file);
  };

  const capture = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92),
    );
    if (blob) {
      setMode('chooser');
      await runSelect(blob);
    }
  };

  return (
    <Modal open={open} onClose={onClose} hideCloseButton borderRadius="24px" bodyPadding="0">
      {mode === 'camera' ? (
        <Camera>
          <Video ref={videoRef} autoPlay playsInline muted $mirror={facing === 'user'} />
          {cameraError ? (
            <CameraError>{cameraError}</CameraError>
          ) : (
            <RoundIcon style={{ top: 15, right: 15 }} onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}>
              <IoCameraReverseOutline size={26} color="#fff" />
            </RoundIcon>
          )}
          {!cameraError && (
            <Capture aria-label="Capture" onClick={capture}>
              <IoCamera size={30} color="#fff" />
            </Capture>
          )}
          <CameraBack onClick={() => setMode('chooser')}>Back</CameraBack>
        </Camera>
      ) : (
        <Body>
          {customMessage ? <Message $color={theme.colors.text}>{customMessage}</Message> : null}
          <Options>
            {enableCamera && (
              <Option onClick={() => setMode('camera')}>
                <IconRing $color={theme.colors.text}>
                  <IoCameraOutline size={30} color={theme.colors.text} />
                </IconRing>
                <OptionLabel $color={theme.colors.text}>{cameraLabel}</OptionLabel>
              </Option>
            )}
            {enableGallery && (
              <Option onClick={onPickGallery}>
                <IconRing $color={theme.colors.text}>
                  <IoCloudUploadOutline size={30} color={theme.colors.text} />
                </IconRing>
                <OptionLabel $color={theme.colors.text}>{galleryLabel}</OptionLabel>
              </Option>
            )}
          </Options>
          <input ref={fileRef} type="file" accept={accept} style={{ display: 'none' }} onChange={onFileChange} />
          <CancelButton type="button" $bg={theme.colors.danger} disabled={isLoading} onClick={onClose}>
            {isLoading ? <Spinner size={18} color="#fff" /> : <IoClose size={22} color="#fff" />}
            <CancelText>{cancelLabel}</CancelText>
          </CancelButton>
        </Body>
      )}
    </Modal>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
`;

const Message = styled.span<{ $color: string }>`
  width: 100%;
  margin-bottom: 16px;
  text-align: center;
  color: ${({ $color }) => $color};
`;

const Options = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const Option = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const IconRing = styled.div<{ $color: string }>`
  padding: 20px;
  border-radius: 50%;
  border: 1px solid ${({ $color }) => $color};
  display: flex;
`;

const OptionLabel = styled.span<{ $color: string }>`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ $color }) => $color};
`;

const CancelButton = styled.button<{ $bg: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-top: 20px;
  padding: 15px 0;
  border: none;
  border-radius: 25px;
  background: ${({ $bg }) => $bg};
  color: #fff;
  cursor: pointer;
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const CancelText = styled.span`
  font-size: 15px;
  font-weight: bold;
  color: #fff;
`;

const Camera = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
`;

const Video = styled.video<{ $mirror: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: ${({ $mirror }) => ($mirror ? 'scaleX(-1)' : 'none')};
`;

const RoundIcon = styled.div`
  position: absolute;
  padding: 8px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 50%;
  display: flex;
  cursor: pointer;
`;

const Capture = styled.div`
  position: absolute;
  bottom: 20px;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  cursor: pointer;
`;

const CameraBack = styled.button`
  position: absolute;
  top: 15px;
  left: 15px;
  border: none;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border-radius: 14px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
`;

const CameraError = styled.div`
  color: #fff;
  text-align: center;
  padding: 0 24px;
  font-size: 14px;
`;
