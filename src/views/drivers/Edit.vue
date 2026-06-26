<template>
  <div class="container-fluid pb-4">
    <Form @submit="updateDriver" :validation-schema="schema">

      <!-- Page header: breadcrumb + driver name + back button -->
      <div class="d-flex flex-wrap gap-2 justify-content-between align-items-start mb-4 px-xxl-5">
        <div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-1">
              <li class="breadcrumb-item text-muted" style="opacity: 0.7">Conductores</li>
              <li class="breadcrumb-item active fw-semibold">Editar conductor</li>
            </ol>
          </nav>
          <h5 class="mb-0 fw-bold" style="color: var(--detail-section-label)">{{ driver.name }}</h5>
        </div>
        <button type="button" @click="goBack" class="btn btn-sm btn-outline-secondary">
          <em class="fas fa-arrow-left me-1"></em>{{ $t('common.actions.back') }}
        </button>
      </div>

      <!-- Profile header card -->
      <div class="card mx-auto mx-xxl-5 mb-4">
        <div class="card-body">
          <div class="d-flex flex-column flex-sm-row gap-4 align-items-start">

            <!-- Avatar with pencil overlay -->
            <div class="position-relative" style="flex: none; padding-top: 0.25rem">
              <div class="detail-avatar-wrapper">
                <img v-if="driver.photoUrl" :src="driver.photoUrl" class="detail-avatar-img" alt="profile_photo">
                <div v-else class="detail-avatar-placeholder">
                  <em class="fa-solid fa-user-astronaut fa-3x text-muted"></em>
                </div>
              </div>
              <button type="button" class="position-absolute detail-avatar-edit-btn"
                      data-bs-toggle="modal" data-bs-target="#image-driver">
                <em class="fas fa-pencil"></em>
              </button>
            </div>

            <!-- Identity inputs -->
            <div class="flex-fill">
              <div class="row g-3">
                <!-- Nombre completo - full row -->
                <div class="col-12">
                  <label class="form-label small fw-bold">{{ $t('users.fields.name') }}</label>
                  <Field name="name" type="text" v-slot="{ field, errorMessage, meta }" v-model="driver.name">
                    <input class="form-control form-control-sm" id="name" aria-label="Name" aria-describedby="name-addon"
                      v-model="field.value" :placeholder="$t('common.placeholders.name')" v-bind="field" />
                    <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
                <!-- Email (readonly + Editar) -->
                <div class="col-md-6">
                  <label class="form-label small fw-bold">{{ $t('users.fields.email') }}</label>
                  <div class="input-group">
                    <input type="email" class="form-control form-control-sm" :placeholder="$t('common.placeholders.email')"
                           readonly aria-label="Email" name="email" aria-describedby="email-addon" v-model="driver.email">
                    <button class="badge bg-secondary border-0" type="button" data-bs-toggle="modal"
                            data-bs-target="#editGmail">
                      {{ $t('common.actions.edit') }}
                    </button>
                  </div>
                </div>
                <!-- Password (readonly + Editar) -->
                <div class="col-md-6">
                  <label class="form-label small fw-bold">{{ $t('users.fields.password') }}</label>
                  <div class="input-group">
                    <input type="password" class="form-control form-control-sm"
                           :placeholder="$t('common.placeholders.password')" readonly aria-label="Password" name="password"
                           aria-describedby="password-addon" v-model="driver.password">
                    <button class="badge bg-secondary border-0" type="button" data-bs-toggle="modal"
                            data-bs-target="#editPassword">
                      {{ $t('common.actions.edit') }}
                    </button>
                  </div>
                </div>
                <!-- Phone -->
                <div class="col-sm-6">
                  <label class="form-label small fw-bold">{{ $t('users.fields.phone') }}</label>
                  <Field name="phone" type="phone" v-model="driver.phone" v-slot="{ errorMessage, meta }">
                    <input class="form-control form-control-sm" v-model="driver.phone" :placeholder="$t('common.placeholders.phone')" id="phone" aria-label="Phone" aria-describedby="phone-addon"/>
                    <span class="is-invalid" v-if="errorMessage && !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
                <!-- Phone2 -->
                <div class="col-sm-6">
                  <label class="form-label small fw-bold">{{ $t('users.fields.phone2') }}</label>
                  <Field name="phone2" type="phone" v-model="driver.phone2" v-slot="{ errorMessage, meta }">
                    <input class="form-control form-control-sm" v-model="driver.phone2" :placeholder="$t('common.placeholders.phone2')" id="phone2" aria-label="Phone 2" aria-describedby="phone2-addon"/>
                    <span class="is-invalid" v-if="errorMessage && !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
                <!-- DocType -->
                <div class="col-sm-3">
                  <label class="form-label small fw-bold">{{ $t('drivers.fields.doc_type') }}</label>
                  <Field name="docType" class="form-select form-select-sm" id="doc_type" as="select" v-model="driver.docType">
                    <option v-for="(type, key) in types" :key="key" :value="type" selected>{{ type }}</option>
                  </Field>
                </div>
                <!-- Document -->
                <div class="col-sm-9">
                  <label class="form-label small fw-bold">{{ $t('drivers.fields.document') }}</label>
                  <Field name="document" type="text" v-slot="{ field, errorMessage, meta }" v-model="driver.document">
                    <input class="form-control form-control-sm" id="document" aria-label="Document"
                      aria-describedby="doc-addon" v-model="field.value"
                      :placeholder="$t('drivers.placeholders.document')" v-bind="field" />
                    <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <!-- Header action row -->
          <div class="d-flex justify-content-end gap-2 pt-3 mt-3"
               style="border-top: 1px solid var(--detail-divider)">
            <button type="button" class="btn btn-sm bg-gradient-secondary" @click="goBack">
              {{ $t('common.actions.close') }}
            </button>
            <button type="submit" class="btn btn-sm bg-gradient-primary">
              {{ $t('common.actions.submit') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Two balanced columns -->
      <div class="row mx-auto mx-xxl-5 mb-4 g-4">

        <!-- LEFT: Vehículos + Dispositivo -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h6 class="detail-section-label">
                <em class="fas fa-car-side me-2" style="color: #cb0c9f"></em>
                {{ $t('drivers.detail.section_vehicles') }}
              </h6>
              <hr class="detail-divider">
              <RosterPanel v-if="driver.id" :driver-id="driver.id" />
              <h6 class="detail-section-label mt-4">
                <em class="fas fa-mobile-screen me-2" style="color: #cb0c9f"></em>
                {{ $t('drivers.detail.section_device') }}
              </h6>
              <hr class="detail-divider">
              <div class="form-group">
                <div class="input-group" v-if="driver.device">
                  <span class="input-group-text"><em class="fas fa-mobile-screen"></em></span>
                  <input type="text" class="form-control form-control-sm disabled"
                         disabled aria-label="Device" name="device.name"
                         aria-describedby="device-addon" v-model="driver.device.name">
                  <button class="badge bg-danger border-0" id="removeDevice" type="button" @click="removeDevice()" style="border-radius: 0 .5rem .5rem 0">
                    <em class="fa fa-solid fa-trash"></em>
                  </button>
                </div>
                <input type="text" class="form-control form-control-sm" v-else
                       :placeholder="$t('common.placeholders.device')" disabled aria-label="Device" name="device"
                       aria-describedby="password-addon" v-model="driver.device">
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Estado y pagos -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h6 class="detail-section-label">
                <em class="fas fa-wallet me-2" style="color: #cb0c9f"></em>
                {{ $t('drivers.detail.section_status_payments') }}
              </h6>
              <hr class="detail-divider">

              <div class="row align-items-end g-3">
                <div class="col-6">
                  <label class="form-label small fw-bold">{{ $t('drivers.fields.status') }}</label>
                  <div class="form-check form-switch">
                    <input class="form-check-input" name="enable" type="checkbox" id="flexSwitchCheckDefault" @change="onEnable" :checked="driver.isEnabled()"/>
                    <label class="form-check-label">{{
                        $t(driver.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled')
                      }}</label>
                    <ErrorMessage name="enable"/>
                  </div>
                </div>
                <div class="col-6">
                  <label class="form-label small fw-bold">{{ $t('drivers.fields.payment_mode') }}</label>
                  <Field name="paymentMode" class="form-select form-select-sm" id="paymentMode" as="select" v-model="driver.paymentMode">
                    <option selected :value="DriverPaymentMode.MONTHLY">{{ $t('common.placeholders.' + DriverPaymentMode.MONTHLY) }}</option>
                    <option :value="DriverPaymentMode.PERCENTAGE">{{ $t('common.placeholders.' + DriverPaymentMode.PERCENTAGE) }}</option>
                  </Field>
                </div>
              </div>

              <hr class="detail-divider my-3">

              <!-- Dark gradient balance block -->
              <div class="rounded-3 p-3 d-flex justify-content-between align-items-center"
                   style="background: linear-gradient(310deg,#141727,#3a416f)">
                <div>
                  <div class="text-uppercase fw-bold mb-1"
                       style="font-size: 0.65rem; color: rgba(255,255,255,0.5); letter-spacing: 0.06em">
                    {{ $t('drivers.forms.current_balance') }}
                  </div>
                  <div class="d-flex align-items-baseline gap-2">
                    <span style="font-size: 1.8rem; font-weight: 700; color: #fff; letter-spacing: -0.03em">{{ StrHelper.formatBalance(driver.balance) }}</span>
                    <span style="font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.4)">{{ branchSelected?.currency_code }}</span>
                  </div>
                </div>
                <button v-if="AuthService.isAdmin()" type="button" class="btn btn-sm"
                        data-bs-target="#balance-modal" data-bs-toggle="modal"
                        style="background: rgba(255,255,255,0.12); color: #fff; border: none; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em">
                  <em class="fas fa-sliders me-1"></em>{{ $t('drivers.forms.manage_balance') }}
                </button>
              </div>

              <!-- Monthly payment trigger -->
              <div v-if="driver.paymentMode === DriverPaymentMode.MONTHLY" class="mt-3">
                <button type="button" class="btn btn-sm btn-outline-primary w-100"
                        data-bs-target="#monthly-payment-modal" data-bs-toggle="modal">
                  <em class="fas fa-calendar-plus me-1"></em>{{ $t('drivers.monthly_payments.open_modal') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>

    <ImageLoader :id="'image-driver'" :resourceId="driver.id" :path="pathDriver" :event="driverEvent"
      @imageDriverLoaded="uploadImgDriver"></ImageLoader>

    <!-- Historial (outside Form) -->
    <div class="card mx-auto mx-xxl-5">
      <div class="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h6 class="mb-0 fw-bold" style="color: var(--detail-section-label)">
          {{ $t('drivers.detail.section_history') }}
        </h6>
        <div class="d-flex gap-2">
          <button type="button" class="history-tab-pill" :class="{ active: activeHistoryTab === 'saldo' }" @click="activeHistoryTab = 'saldo'">
            <em class="fas fa-coins me-1"></em>{{ $t('drivers.detail.tab_saldo') }}
          </button>
          <button type="button" class="history-tab-pill" :class="{ active: activeHistoryTab === 'mensualidades' }" @click="activeHistoryTab = 'mensualidades'">
            <em class="fas fa-calendar-check me-1"></em>{{ $t('drivers.detail.tab_mensualidades') }}
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <!-- Saldo pane -->
        <template v-if="activeHistoryTab === 'saldo'">
          <p v-if="recharges.length === 0" class="text-muted small p-3 mb-0">{{ $t('drivers.detail.empty_recharges') }}</p>
          <template v-else>
            <div class="table-responsive payhist">
              <table class="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>{{ $t('drivers.recharges.col_date') }}</th>
                    <th>{{ $t('drivers.recharges.col_amount') }}</th>
                    <th>{{ $t('drivers.recharges.col_balance') }}</th>
                    <th>{{ $t('drivers.recharges.col_actor') }}</th>
                    <th>{{ $t('drivers.recharges.col_note') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in recharges" :key="r.id">
                    <td>
                      <span class="payhist-cell-icon">
                        <em class="fas fa-clock payhist-clock"></em>
                        {{ dayjs.unix(r.created_at).format('DD/MM/YY HH:mm') }}
                      </span>
                    </td>
                    <td :class="[r.amount >= 0 ? 'text-success' : 'text-danger', 'payhist-amount', 'fw-bold']">
                      {{ (r.amount >= 0 ? '+' : '') + (r.amount ?? 0).toLocaleString('es-CO') + ' COP' }}
                    </td>
                    <td class="payhist-balance">
                      {{ (r.balanceAfter ?? 0).toLocaleString('es-CO') + ' COP' }}
                    </td>
                    <td>
                      <span class="payhist-actor">
                        <span class="payhist-avatar">{{ initials(r.createdByName) }}</span>
                        {{ r.createdByName }}
                      </span>
                    </td>
                    <td>
                      <span v-if="r.note" class="payhist-note-pill">{{ r.note }}</span>
                      <span v-else class="payhist-dash">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="payhist payhist-footer">
              {{ $t('drivers.detail.count_movements', { n: rechargesTotal }, rechargesTotal) }}
            </div>
          </template>
        </template>
        <!-- Mensualidades pane -->
        <template v-else>
          <p v-if="monthlyPayments.length === 0" class="text-muted small p-3 mb-0">{{ $t('drivers.detail.empty_monthly_payments') }}</p>
          <template v-else>
            <div class="table-responsive payhist">
              <table class="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>{{ $t('drivers.monthly_payments.col_period') }}</th>
                    <th>{{ $t('drivers.monthly_payments.col_amount') }}</th>
                    <th>{{ $t('drivers.monthly_payments.col_actor') }}</th>
                    <th>{{ $t('drivers.monthly_payments.col_date') }}</th>
                    <th>{{ $t('drivers.monthly_payments.col_note') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in monthlyPayments" :key="p.id">
                    <td>
                      <span class="payhist-period-pill">{{ p.period }}</span>
                    </td>
                    <td class="payhist-balance fw-bold">
                      {{ (p.amount ?? 0).toLocaleString('es-CO') + ' COP' }}
                    </td>
                    <td>
                      <span class="payhist-actor">
                        <span class="payhist-avatar">{{ initials(p.createdByName) }}</span>
                        {{ p.createdByName }}
                      </span>
                    </td>
                    <td>
                      <span class="payhist-cell-icon">
                        <em class="fas fa-clock payhist-clock"></em>
                        {{ dayjs.unix(p.created_at).format('DD/MM/YY HH:mm') }}
                      </span>
                    </td>
                    <td>
                      <span v-if="p.note" class="payhist-note-pill">{{ p.note }}</span>
                      <span v-else class="payhist-dash">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="payhist payhist-footer">
              {{ $t('drivers.detail.count_monthly', { n: monthlyPaymentsTotal }, monthlyPaymentsTotal) }}
            </div>
          </template>
        </template>
      </div>
    </div>

  </div>

  <!-- Modal Balance -->
  <div class="modal fade" id="balance-modal" tabindex="-1" aria-labelledby="balanceModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 rounded-3">
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center gap-2">
            <span class="modal-icon-chip">
              <em class="fas fa-coins"></em>
            </span>
            <h6 class="modal-title mb-0" id="balanceModalLabel">{{ $t('drivers.forms.manage_balance_title') }}</h6>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Current balance card -->
          <div class="rounded-3 p-3 mb-3"
               style="background: linear-gradient(310deg,#141727,#3a416f)">
            <div class="text-uppercase fw-bold mb-1"
                 style="font-size: 0.65rem; color: rgba(255,255,255,0.5); letter-spacing: 0.06em">
              {{ $t('drivers.forms.current_balance') }}
            </div>
            <div class="d-flex align-items-baseline gap-2">
              <span style="font-size: 1.8rem; font-weight: 700; color: #fff; letter-spacing: -0.03em">{{ StrHelper.formatBalance(driver.balance) }}</span>
              <span style="font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.4)">{{ branchSelected?.currency_code }}</span>
            </div>
          </div>

          <!-- Adjustment type toggle -->
          <div class="form-group mb-3">
            <label class="form-label">{{ $t('drivers.forms.adjustment_type') }}</label>
            <div class="btn-group w-100" role="group">
              <button type="button"
                      :class="adjustmentType === 'add' ? 'btn btn-outline-success active' : 'btn btn-outline-secondary'"
                      @click="adjustmentType = 'add'">
                <em class="fas fa-plus me-1"></em>{{ $t('drivers.forms.adjustment_add') }}
              </button>
              <button type="button"
                      :class="adjustmentType === 'subtract' ? 'btn btn-outline-secondary active' : 'btn btn-outline-secondary'"
                      @click="adjustmentType = 'subtract'">
                <em class="fas fa-minus me-1"></em>{{ $t('drivers.forms.adjustment_subtract') }}
              </button>
            </div>
          </div>

          <!-- Amount -->
          <div class="form-group mb-3">
            <label class="form-label">{{ $t('drivers.forms.amount_cop') }}</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input type="number" class="form-control" v-model="newBalance" min="0"
                     :placeholder="$t('drivers.forms.amount_placeholder')" />
            </div>
          </div>

          <!-- Note -->
          <div class="form-group">
            <label class="form-label">{{ $t('drivers.forms.recharge_note') }}</label>
            <textarea class="form-control" v-model="rechargeNote" rows="2"
                      :placeholder="$t('drivers.forms.adjustment_note_placeholder')"></textarea>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
            {{ $t('common.actions.cancel') }}
          </button>
          <button @click="addBalance" type="button" class="btn bg-gradient-primary">{{ $t('drivers.forms.apply_adjustment') }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Monthly Payment -->
  <div class="modal fade" id="monthly-payment-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 rounded-3">
        <div class="modal-header border-bottom">
          <div class="d-flex align-items-center gap-2">
            <span class="modal-icon-chip">
              <em class="fas fa-calendar-check"></em>
            </span>
            <h6 class="modal-title mb-0">{{ $t('drivers.monthly_payments.modal_title') }}</h6>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="mb-2">{{ $t('drivers.monthly_payments.field_period') }}</label>
            <div class="period-pill-row">
              <button
                v-for="opt in periodOptions"
                :key="opt.value"
                type="button"
                class="history-tab-pill"
                :class="{ active: monthlyPaymentPeriod === opt.value }"
                @click="monthlyPaymentPeriod = opt.value"
              >{{ opt.label }}</button>
            </div>
          </div>
          <div class="form-group mt-3">
            <label>{{ $t('drivers.monthly_payments.field_amount') }}</label>
            <div class="input-group mt-1">
              <span class="input-group-text">$</span>
              <input type="number" class="form-control" v-model="monthlyPaymentAmount" min="0" />
            </div>
          </div>
          <div class="monthly-info-box mt-3 d-flex align-items-start gap-2">
            <em class="fas fa-info-circle text-info mt-1 flex-shrink-0"></em>
            <span>{{ $t('drivers.monthly_payments.info_registered_by', { name: currentUserName }) }}</span>
          </div>
          <div class="form-group mt-3">
            <label>{{ $t('drivers.monthly_payments.field_note') }}</label>
            <textarea class="form-control mt-1" rows="3" v-model="monthlyPaymentNote" :placeholder="$t('drivers.monthly_payments.placeholder_note')"></textarea>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            {{ $t('common.actions.cancel') }}
          </button>
          <button @click="addMonthlyPayment" type="button" class="btn bg-gradient-primary">
            <em class="fas fa-calendar-plus me-1"></em>{{ $t('drivers.monthly_payments.action_register') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Edit Gmail -->
  <div class="modal fade" id="editGmail" tabindex="-1" aria-labelledby="editGmailLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 rounded-3">
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center gap-2">
            <span class="modal-icon-chip">
              <em class="fas fa-envelope"></em>
            </span>
            <h6 class="modal-title mb-0" id="editGmailLabel">{{ $t('users.forms.edit') }}</h6>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <Form @submit="updateEmail" :validation-schema="schemaEmail">
          <div class="modal-body">
            <div class="mb-3">
              <Field name="email" type="email" v-slot="{ field }" v-model="driver.email">
                <input class="form-control form-control-sm" id="email" aria-label="Email" aria-describedby="email-addon"
                  v-model="field.value" :placeholder="$t('common.placeholders.email')" v-bind="field" />
              </Field>
              <ErrorMessage name="email" />
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
              {{ $t('common.actions.close') }}
            </button>
            <button type="submit" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
          </div>
        </Form>
      </div>
    </div>
  </div>

  <!-- Modal Edit Password -->
  <div class="modal fade" id="editPassword" tabindex="-1" aria-labelledby="editPasswordLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 rounded-3">
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center gap-2">
            <span class="modal-icon-chip">
              <em class="fas fa-key"></em>
            </span>
            <h6 class="modal-title mb-0" id="editPasswordLabel">{{ $t('users.forms.edit_password') }}</h6>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <Form @submit="updatePassword" :validation-schema="schemaPassword">
          <div class="modal-body">
            <div class="mb-3">
              <Field name="password" type="password" v-slot="{ field }" v-model="driver.password">
                <div class="input-group">
                  <span style="cursor: pointer" class="input-group-text" @click="showPassword = !showPassword">
                    <i class="fa" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'"></i>
                  </span>
                  <input class="form-control form-control-sm" id="password" aria-label="Password" aria-describedby="password-addon" v-model="field.value"
                    :placeholder="$t('common.placeholders.password')" v-bind="field"
                    :type="showPassword ? 'text' : 'password'" />
                </div>
              </Field>
              <ErrorMessage name="password" />
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
              {{ $t('common.actions.close') }}
            </button>
            <button type="submit" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StorageService from '@/services/StorageService'
import { ErrorMessage, Field, Form } from 'vee-validate'
import dayjs from 'dayjs'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import { Constants } from '@/constants/Constants'
import ToastService from '@/services/ToastService'
import ImageLoader from '@/components/ImageLoader.vue'
import RosterPanel from '@/components/vehicles/RosterPanel.vue'
import i18n from '@/plugins/i18n'
import { computed, onBeforeMount, onMounted, ref, Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDriversStore } from '@/services/stores/DriversStore'
import { mixed, object, string } from 'yup'
import { useLoadingState } from '@/services/stores/LoadingState'
import { hide } from '@/helpers/ModalHelper'
import { StrHelper } from '@/helpers/StrHelper'
import { useI18n } from 'vue-i18n'
import AuthService from '@/services/AuthService'
import { useSettingsStore } from '@/services/stores/SettingsStore'
import { storeToRefs } from 'pinia'
import { DriverPaymentMode } from '@/constants/DriverPaymentMode'
import { RechargeInterface } from '@/types/RechargeInterface'
import MonthlyPaymentSettingsRepository from '@/repositories/MonthlyPaymentSettingsRepository'
import { MonthlyPaymentInterface } from '@/types/MonthlyPaymentInterface'
const driver: Ref<Driver> = ref(new Driver)
const recharges: Ref<RechargeInterface[]> = ref([])
const rechargesTotal = ref(0)
const monthlyPaymentPeriod = ref(dayjs().format('YYYY-MM'))
const monthlyPaymentAmount = ref(0)
const monthlyPaymentNote = ref('')
const monthlyPayments: Ref<MonthlyPaymentInterface[]> = ref([])
const monthlyPaymentsTotal = ref(0)
const suggestedAmount = ref(0)
const types: Ref<Array<string>> = ref(Constants.DOC_TYPES)
const showPassword = ref(false);
const driverEvent = 'image-driver-loaded'
const pathDriver = StorageService.driverPath
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const driverStore = useDriversStore()
const currentUser = AuthService.getCurrentUser()
const currentUserName = computed(() => currentUser.name || '—')
const periodOptions = computed(() =>
  Array.from({ length: 5 }, (_, i) => {
    const d = dayjs().subtract(i, 'month')
    const raw = d.format('MMM YY')
    const label = raw.charAt(0).toUpperCase() + raw.slice(1)
    return { label, value: d.format('YYYY-MM') }
  })
)
const { setLoading } = useLoadingState()
const newBalance = ref(0)
const rechargeNote = ref('')
const adjustmentType = ref<'add' | 'subtract'>('add')
const activeHistoryTab = ref<'saldo' | 'mensualidades'>('saldo')
const { branchSelected } = storeToRefs(useSettingsStore())
const schema = object().shape({
  name: string().required().min(3),
  phone: string().required().min(8),
  docType: mixed().oneOf(Constants.DOC_TYPES).required(),
  document: string().required().min(6).max(10),
})

watch(driver, (newDriver) => {
  driver.value.name = StrHelper.toCamelCase(newDriver.name ?? '')
  driver.value.phone = StrHelper.formatNumber(newDriver.phone ?? '')
}, { deep: true })

const schemaEmail = object().shape({
  email: string().required().email()
})

const schemaPassword = object().shape({
  password: string().required()
})


function goBack() {
  router.back()
}

async function loadRecharges(): Promise<void> {
  if (!driver.value.id) return
  try {
    const result = await DriverRepository.listRecharges(driver.value.id)
    recharges.value = result.recharges
    rechargesTotal.value = result.total
  } catch (e) {
    // silent fail — history is non-critical
  }
}

async function loadMonthlyPayments(): Promise<void> {
  if (!driver.value.id) return
  try {
    const result = await DriverRepository.listMonthlyPayments(driver.value.id)
    monthlyPayments.value = result.rows
    monthlyPaymentsTotal.value = result.total
  } catch (e) {
    // silent fail — history is non-critical
  }
}

async function loadSuggestedAmount(): Promise<void> {
  try {
    const settings = await MonthlyPaymentSettingsRepository.get()
    suggestedAmount.value = settings.suggested_amount
    monthlyPaymentAmount.value = settings.suggested_amount
  } catch (e) {
    // silent fail — keep default 0
  }
}

onBeforeMount(() => {
  const id = route.params.id as string
  const driverTmp = driverStore.findById(id)
  if (driverTmp) {
    driver.value = driverTmp
  }
  setLoading(true)
  DriverRepository.getDriver(id)
    .then(async (updatedDriverData) => {
      const updatedDriver = new Driver()
      Object.assign(updatedDriver, updatedDriverData)
      driverStore.addDriver(updatedDriver)
      Object.assign(driver.value, updatedDriver)
      await loadRecharges()
      await loadMonthlyPayments()
      await loadSuggestedAmount()
      setLoading(false)
    })
    .catch(async (e) => {
      setLoading(false)
      await ToastService.toast(
        ToastService.ERROR,
        i18n.global.t('common.messages.error'),
        e.message
      )
    })
})

onMounted(() => {
  const balanceModalEl = document.getElementById('balance-modal')
  if (balanceModalEl) {
    balanceModalEl.addEventListener('hidden.bs.modal', () => {
      newBalance.value = 0
      rechargeNote.value = ''
      adjustmentType.value = 'add'
    })
  }
})

function uploadImgDriver(url: string): void {
  driver.value.photoUrl = url
  updateDriver()
}

function updateDriver(): void {
  setLoading(true)
  DriverRepository.update(driver.value).then(async () => {
    setLoading(false)
   await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function updateEmail(): void {
  setLoading(true)
  DriverRepository.updateEmail(driver.value.id, driver.value.email).then(async () => {
    setLoading(false)
    hide('editGmail')
   await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
   await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function updatePassword(): void {
  setLoading(true)
  DriverRepository.updatePassword(driver.value.id, driver.value.password).then(async () => {
    setLoading(false)
    hide('editPassword')
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
   await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function addBalance(): void {
  if (!newBalance.value || newBalance.value <= 0) return
  const amount = adjustmentType.value === 'subtract' ? -Math.abs(newBalance.value) : Math.abs(newBalance.value)
  setLoading(true)
  DriverRepository.createRecharge(driver.value, amount, rechargeNote.value).then(async (result) => {
    driver.value.balance = result.driver.balance
    newBalance.value = 0
    rechargeNote.value = ''
    adjustmentType.value = 'add'
    await loadRecharges()
    setLoading(false)
    hide('balance-modal')
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function addMonthlyPayment(): void {
  setLoading(true)
  DriverRepository.createMonthlyPayment(driver.value.id, {
    period: monthlyPaymentPeriod.value,
    amount: monthlyPaymentAmount.value,
    note: monthlyPaymentNote.value || null,
  }).then(async (result) => {
    driver.value.enabled_at = result.driver.enabled_at
    monthlyPaymentPeriod.value = dayjs().format('YYYY-MM')
    monthlyPaymentAmount.value = suggestedAmount.value
    monthlyPaymentNote.value = ''
    await loadMonthlyPayments()
    setLoading(false)
    hide('monthly-payment-modal')
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    setLoading(false)
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function onEnable(event: Event): void {
  setLoading(true)
  const target = event.target as HTMLInputElement
  const previousEnabledAt = driver.value.enabled_at
  driver.value.enabled_at = target.checked ? dayjs().unix() : 0
  DriverRepository.enable(driver.value.id ?? '', driver.value.enabled_at).then(async () => {
    setLoading(false)
    const message = driver.value.enabled_at == 0 ?
      i18n.global.t('users.messages.disabled') : i18n.global.t('users.messages.enabled')
   await ToastService.toast(ToastService.SUCCESS, message)
  }).catch(async e => {
    setLoading(false)
    driver.value.enabled_at = previousEnabledAt
   await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function removeDevice(): void {
  driver.value.device = null
}

const initials = (name: string): string => {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return parts.slice(0, 2).map(w => w[0]).join('').toUpperCase()
}
</script>

<style scoped lang="scss">
.detail-avatar-wrapper {
  width: 76px;
  height: 76px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: linear-gradient(310deg, #7928ca, #ff0080);
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-avatar-img {
  width: 76px;
  height: 76px;
  object-fit: cover;
}

.detail-avatar-placeholder {
  width: 76px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
}

.detail-avatar-edit-btn {
  bottom: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(310deg, #2152ff, #21d4fd);
  border: 2px solid var(--card-bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.55rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  line-height: 1;
  padding: 0;
}

.detail-section-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--detail-section-label);
  margin-bottom: 0.25rem;
}

:global(body.dark-version) .detail-section-label {
  color: rgba(255, 255, 255, 0.92) !important;
}

.detail-divider {
  border-color: var(--detail-divider);
  opacity: 1;
  margin: 0.75rem 0;
}

:global(body.dark-version) .detail-divider {
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.history-tab-pill {
  padding: 0.35rem 0.9rem;
  border-radius: 50rem;
  border: 1px solid var(--detail-divider);
  background: var(--card-bg);
  color: var(--muted-text);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &.active {
    border-color: #cb0c9f;
    background: var(--detail-pill-active-bg);
    color: var(--detail-pill-active-text);
  }
}

.modal-icon-chip {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: linear-gradient(310deg, #7928ca, #ff0080);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.78rem;
  flex: none;
}

.period-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.monthly-info-box {
  --monthly-info-bg: rgba(23, 193, 232, 0.08);
  --monthly-info-text: #67748e;
  background: var(--monthly-info-bg);
  color: var(--monthly-info-text);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.82rem;
}

:global(body.dark-version) .monthly-info-box {
  --monthly-info-bg: rgba(255, 255, 255, 0.06);
  --monthly-info-text: rgba(255, 255, 255, 0.75);
}

.payhist {
  --payhist-th-color: #8392ab;
  --payhist-th-bg: rgba(0, 0, 0, 0.02);
  --payhist-td-border: #f3f4f6;
  --payhist-td-color: #67748e;
  --payhist-clock: #d2d6da;
  --payhist-heading: #344767;
  --payhist-pill-bg: #f3f4f6;
  --payhist-pill-text: #67748e;
  --payhist-footer: #adb5bd;

  th {
    background: var(--payhist-th-bg);
    color: var(--payhist-th-color);
    text-transform: uppercase;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0.6rem 1.25rem;
    border-bottom: none;
  }

  td {
    color: var(--payhist-td-color);
    border-bottom: 1px solid var(--payhist-td-border);
    padding: 0.75rem 1.25rem;
    font-size: 0.8rem;
    vertical-align: middle;
  }
}

:global(body.dark-version) .payhist {
  --payhist-th-color: rgba(255, 255, 255, 0.55);
  --payhist-th-bg: rgba(255, 255, 255, 0.04);
  --payhist-td-border: rgba(255, 255, 255, 0.08);
  --payhist-td-color: rgba(255, 255, 255, 0.7);
  --payhist-clock: rgba(255, 255, 255, 0.3);
  --payhist-heading: rgba(255, 255, 255, 0.9);
  --payhist-pill-bg: rgba(255, 255, 255, 0.08);
  --payhist-pill-text: rgba(255, 255, 255, 0.7);
  --payhist-footer: rgba(255, 255, 255, 0.4);
}

.payhist-clock {
  color: var(--payhist-clock);
  font-size: 0.7rem;
}

.payhist-cell-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.payhist-actor {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.payhist-amount {
  font-weight: 700;
}

.payhist-balance {
  color: var(--payhist-heading);
  font-weight: 600;
}

.payhist-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(310deg, #7928ca, #ff0080);
  color: #fff;
  font-weight: 700;
  font-size: 0.62rem;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.payhist-note-pill {
  background: var(--payhist-pill-bg);
  color: var(--payhist-pill-text);
  padding: 0.15rem 0.5rem;
  border-radius: 50rem;
  font-size: 0.72rem;
}

.payhist-period-pill {
  background: linear-gradient(310deg, #7928ca, #ff0080);
  color: #fff;
  padding: 0.15rem 0.55rem;
  border-radius: 50rem;
  font-size: 0.72rem;
  font-weight: 700;
}

.payhist-dash {
  color: var(--payhist-clock);
}

.payhist-footer {
  color: var(--payhist-footer);
  font-size: 0.72rem;
  padding: 0.6rem 1.25rem;
  border-top: 1px solid var(--payhist-td-border);
}
</style>
