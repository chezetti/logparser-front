import { ILogLevelExpectation, ILogLevelInfo } from "./log-level.interface";
import { ITransportLogOccuranceFrequency } from "./occurance-frequency.interface";

export interface IParsedLog {
  logLevelInfo: ILogLevelInfo;
  occuranceFrequency: ITransportLogOccuranceFrequency;
  logLevelExpectation: ILogLevelExpectation;
}
