import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function ReminderDialog({ open, onClose, classInfo, onSave }) {
  const [reminderTime, setReminderTime] = useState('');

  const handleSave = () => {
    onSave(reminderTime);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Reminder</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm mb-2">
            Subject: <strong>{classInfo?.subject?.name}</strong>
          </p>
          <p className="text-sm mb-4">
            Class Time: {dayjs(classInfo?.startTime).format('dddd, HH:mm')}
          </p>
          <Input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Set Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
