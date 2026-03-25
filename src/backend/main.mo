import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  // Types
  type MessageInput = {
    author : Text;
    text : Text;
  };

  type Message = {
    author : Text;
    message : Text;
  };

  // State
  let messages = Map.empty<Principal, Message>();

  // Public Functions
  func requireNewMessage(submitter : Principal) {
    if (messages.containsKey(submitter)) {
      Runtime.trap("You already submitted a message");
    };
  };

  func validInput(input : MessageInput) : Bool {
    input.author.size() > 0 and input.text.size() > 0;
  };

  public shared ({ caller }) func submitMessage(input : MessageInput) : async () {
    requireNewMessage(caller);

    if (not validInput(input)) {
      Runtime.trap("Name and message must not be empty");
    };

    let message : Message = {
      author = input.author;
      message = input.text;
    };
    messages.add(caller, message);
  };

  public query ({ caller }) func getAllMessages() : async [Message] {
    messages.values().toArray();
  };

  public query ({ caller }) func getMessageByAuthor(author : Principal) : async Message {
    switch (messages.get(author)) {
      case (null) {
        Runtime.trap("No message found for this author");
      };
      case (?msg) { msg };
    };
  };

  public shared ({ caller }) func deleteMessage() : async () {
    if (not messages.containsKey(caller)) {
      Runtime.trap("No message to delete");
    };
    messages.remove(caller);
  };
};
