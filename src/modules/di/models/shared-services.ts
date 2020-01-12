import * as toastr from 'toastr';
import * as axios from 'axios';

export type HttpClient = typeof axios.default;
export type ToasterService = typeof toastr;
