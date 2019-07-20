import { Observable, Subject, BehaviorSubject } from 'rxjs';

export class MessageService {
    private subject = new BehaviorSubject<any>("FirstCall");
    message$ = this.subject.asObservable();
    //observ : Observable <String>;
    sendMessage(message: string) { 
        console.log('sendMesg',message)
        this.subject.next({ text: message });
        
    }
    clearMessage() {
        this.subject.next("");
    }

    // getMessage(): Observable<String> {
    //     console.log("in Message");
    //     return this.message$;
    //     // this.observ = new Observable(observer => {
           
    //     // observer.next("Printed");
    //     //     observer.complete();        
    //     // });
    //     //return this.observ;
    // }
    
}