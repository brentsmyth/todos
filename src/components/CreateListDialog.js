import { useState, useCallback } from 'react';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';

const CreateListDialog = ({ visible, onCreate, onCancel }) => {
  const [newListName, setNewListName] = useState('');

  const handleCreateList = useCallback(() => {
    onCreate(newListName);
    setNewListName('');
  }, [onCreate, newListName]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>Create new list</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="List name"
            value={newListName}
            onChangeText={(text) => setNewListName(text)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Cancel</Button>
          <Button onPress={handleCreateList}>Create</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CreateListDialog;

