import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { MessageData, generateMessage } from '../../../utils/MessageGenerator';
import AnimatedListItem from './AnimatedListItem';
import { Card, CardContent } from '@/components/ui/card';

export default function MotionList() {
  return (
    <Card className="rounded-lg border-none mt-6 overflow-hidden">
      <CardContent className="p-0 relative h-full">
        <main className="flex min-h-screen items-center justify-center ">
          <div className="h-[800px] w-full max-w-lg">
            <EmailComponent />
          </div>
        </main>
      </CardContent>
    </Card>
  );
}

const EmailComponent = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const addMessage = () => {
    const newMessage = generateMessage();

    setMessages((prev) => {
      return [...prev, newMessage];
    });
  };

  const toggleMessage = (id: string) => {
    if (selectedMessages.includes(id)) {
      setSelectedMessages((prev) => {
        return prev.filter((i) => i != id);
      });
    } else {
      setSelectedMessages((prev) => {
        return [...prev, id];
      });
    }
  };

  const archiveMessages = () => {
    setMessages((prev) =>
      prev.filter((message) => !selectedMessages.includes(message.id)),
    );
    setSelectedMessages([]);
  };

  return (
    <div className="bg-background rounded-xl border-b-muted border-[1px]">
      <div className="flex justify-between w-full border-b-muted border-b-[1px] p-4">
        <button
          className="text-zinc-400 -mx-2 rounded px-2 py-1 hover:text-zinc-500"
          onClick={addMessage}
        >
          Add
        </button>
        <button
          className="text-zinc-400 -mx-2 rounded px-2 py-1 hover:text-zinc-500"
          onClick={archiveMessages}
        >
          Archive
        </button>
      </div>
      <div className="overflow-y-scroll px-3 py-2 max-h-[400px]">
        <ul>
          <AnimatePresence initial={false}>
            {messages.length == 0 && (
              <AnimatedListItem>
                <h1 className="text-center font-semibold py-4">
                  You have no messages.
                </h1>
              </AnimatedListItem>
            )}
            {[...messages].reverse().map((message) => (
              <AnimatedListItem key={message.id}>
                <div className="py-0.5 transition">
                  <button
                    onClick={() => toggleMessage(message.id)}
                    className={`flex flex-col w-full p-4 rounded-md transition-colors ${
                      selectedMessages.includes(message.id)
                        ? 'bg-main'
                        : 'bg-background'
                    }`}
                  >
                    <p
                      className={`font-medium transition-colors ${
                        selectedMessages.includes(message.id)
                          ? 'text-tmain'
                          : 'text-treverse'
                      }`}
                    >
                      {message.content[0]}
                    </p>
                    <span
                      className={`text-sm transition-colors ${
                        selectedMessages.includes(message.id)
                          ? 'text-tsecondary'
                          : 'text-treverse'
                      }`}
                    >
                      {message.content[1]}
                    </span>
                  </button>
                </div>
              </AnimatedListItem>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};
