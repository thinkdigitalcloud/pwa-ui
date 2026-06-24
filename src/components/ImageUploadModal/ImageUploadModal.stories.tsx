import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '../Button';
import { ImageUploadModal } from './ImageUploadModal';

const meta: Meta<typeof ImageUploadModal> = {
  title: 'Modals/ImageUploadModal',
  component: ImageUploadModal,
  parameters: { layout: 'centered' },
  args: {
    onSelect: fn(),
    cameraLabel: 'Camera',
    galleryLabel: 'Gallery',
    cancelLabel: 'CANCEL',
  },
};
export default meta;

type Story = StoryObj<typeof ImageUploadModal>;

// Opens the modal from a button and reports the chosen image's size/type.
const Demo = (args: React.ComponentProps<typeof ImageUploadModal>) => {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <Button text="Upload image" onClick={() => setOpen(true)} />
      {picked && <span style={{ fontSize: 13 }}>{picked}</span>}
      <ImageUploadModal
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        onSelect={async (image) => {
          const kind = image instanceof File ? `file "${image.name}"` : 'camera capture';
          setPicked(`Selected ${kind} — ${Math.round(image.size / 1024)} KB, ${image.type}`);
          args.onSelect?.(image);
          setOpen(false);
        }}
      />
    </div>
  );
};

export const Default: Story = { render: (args) => <Demo {...args} /> };

export const WithMessage: Story = {
  render: (args) => <Demo {...args} />,
  args: { customMessage: 'Upload a clear photo of your ID document.' },
};

export const GalleryOnly: Story = {
  render: (args) => <Demo {...args} />,
  args: { enableCamera: false },
};

export const CameraOnly: Story = {
  render: (args) => <Demo {...args} />,
  args: { enableGallery: false },
};
