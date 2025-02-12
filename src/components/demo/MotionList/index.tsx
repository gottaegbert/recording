import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { MessageData, generateMessage } from '../../../utils/MessageGenerator';
import AnimatedListItem from './AnimatedListItem';
import { Card, CardContent } from '@/components/ui/card';

export default function MotionList() {
  return (
    <Card className="mt-6 overflow-hidden rounded-lg border-none">
      <CardContent className="relative h-full p-0">
        <main className="flex min-h-screen items-center justify-center">
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
    <div className="rounded-xl border-[1px] border-b-muted bg-background">
      <div className="flex w-full justify-between border-b-[1px] border-b-muted p-4">
        <button
          className="-mx-2 rounded px-2 py-1 text-zinc-400 hover:text-zinc-500"
          onClick={addMessage}
        >
          Add
        </button>
        <button
          className="-mx-2 rounded px-2 py-1 text-zinc-400 hover:text-zinc-500"
          onClick={archiveMessages}
        >
          Archive
        </button>
      </div>
      <div className="custom-scrollbar max-h-[400px] overflow-y-auto px-3 py-2">
        <ul>
          <AnimatePresence initial={false}>
            {messages.length == 0 && (
              <AnimatedListItem>
                <h1 className="py-4 text-center font-semibold">
                  You have no messages.
                </h1>
              </AnimatedListItem>
            )}
            {[...messages].reverse().map((message) => (
              <AnimatedListItem key={message.id}>
                <div className="py-0.5 transition">
                  <button
                    onClick={() => toggleMessage(message.id)}
                    className={`flex w-full flex-col rounded-md p-4 transition-colors ${
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
