import {config} from '@vue/test-utils'
import AuthService from "@/services/AuthService";
import User from "@/models/User";
import UserMock from "./mocks/entities/UserMock";

jest.mock('firebase/app')
jest.mock('firebase/auth')
jest.mock('firebase/database')
jest.mock('firebase/storage')

AuthService.currentUser = Object.assign(new User(), UserMock)

config.global.mocks = {}